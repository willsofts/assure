import { KnModel } from "@willsofts/will-db";
import { DH } from "@willsofts/will-dh";
import { UserTokenInfo } from "@willsofts/will-lib";
import { KnDBConnector, KnSQL, KnResultSet, KnRecordSet } from "@willsofts/will-sql";
import { KnContextInfo, KnDiffieInfo } from '../models/KnCoreAlias';
import { TknAuthorizeHandler } from "./TknAuthorizeHandler";
import { TknSchemeHandler } from "./TknSchemeHandler";

export class TknDiffieHandler extends TknSchemeHandler {
    public model : KnModel = { name: "tusertoken", alias: { privateAlias: this.section } };

    //declared addon actions name
    public handlers = [ {name: "dh"}, {name:"encrypt"}, {name: "decrypt"} ];

    public dh(context: KnContextInfo) : Promise<any> {
        return this.diffie(context);
    }

    public async diffie(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: "diffie", raw: false}, this.doDiffie);
    }

    public async doDiffie(context: KnContextInfo, model: KnModel) : Promise<any> {
        let dh = await this.createDiffie(context);
        this.logger.debug(this.constructor.name+".doDiffie: dh",dh);
        let info = this.createKnDiffieInfo(dh);
        let body = { info: info };
        this.doSaveDiffie(context, model, dh).then(rs => { this.logger.debug(this.constructor.name+".doSaveDiffie",rs); });
        return Promise.resolve(body);
    }

    public async createDiffie(context: KnContextInfo) : Promise<DH> {
        let session : any = context.meta?.session;
        let dh = new DH();
        if(session && session.hasOwnProperty("dh")) {
            let diffie = session.dh as DH;        
            dh.prime = diffie.prime;
            dh.generator = diffie.generator;
            dh.privateKey = diffie.privateKey;
            dh.publicKey = diffie.publicKey;
            dh.sharedKey = diffie.sharedKey;
            dh.otherPublicKey = diffie.otherPublicKey;
        } else {
            await dh.init();
        }
        let publickey = context.params.publickey;
        if(publickey) {
            dh.otherPublicKey = publickey;
            dh.computeSharedKey();
        }
        if(session) session.dh = dh;
        return Promise.resolve(dh);
    }

    public createKnDiffieInfo(dh: DH) : KnDiffieInfo {
        return { 
            prime: dh.prime, 
            generator: dh.generator,
            publickey: dh.publicKey,
        }
    }

    public async doSaveDiffie(context: KnContextInfo, model: KnModel, dh: DH) : Promise<KnResultSet | undefined> {
        let userInfo = await this.getUserTokenInfo(context);
        this.logger.debug(this.constructor.name+".doSaveDiffie: userInfo",userInfo);
        if(userInfo) {
            let db = this.getPrivateConnector(model);
            try {
                return await this.saveDiffie(db, userInfo, dh, context);
            } catch(ex: any) {
                this.logger.error(this.constructor.name,ex);
                return Promise.reject(this.getDBError(ex));
            } finally {
                if(db) db.close();
            }
        }
        return Promise.resolve(undefined);
    }

    public async saveDiffie(db: KnDBConnector, userInfo: UserTokenInfo, dh: DH, context?: any) : Promise<KnResultSet> {
        let sql = new KnSQL();
        sql.append("update tusertoken set prime=?prime, generator=?generator, privatekey=?privatekey, ");
        sql.append("publickey=?publickey, sharedkey=?sharedkey, otherkey=?otherkey, tokenstatus=?tokenstatus ");
        sql.append("where useruuid=?useruuid ");
        sql.set("prime",dh.prime);
        sql.set("generator",dh.generator);
        sql.set("privatekey",dh.privateKey);
        sql.set("publickey",dh.publicKey);
        sql.set("sharedkey",dh.sharedKey);
        sql.set("otherkey",dh.otherPublicKey);
        sql.set("tokenstatus",userInfo.tokenstatus);
        sql.set("useruuid",userInfo.useruuid);
        this.logger.info(this.constructor.name+".saveDiffie",sql);
        let rs = await sql.executeUpdate(db,context);
        return Promise.resolve(rs);
    }
    
    protected override async doUpdate(context: any, model: KnModel) : Promise<KnRecordSet> {
        let result : KnResultSet = { rows: null, columns: null };
        let userInfo = null;
        let token = this.getTokenKey(context);
        this.logger.debug(this.constructor.name+".doUpdate: token",token);
        let db = this.getPrivateConnector(model);
        try {
            if (token != undefined) {
                let alib : TknAuthorizeHandler = new TknAuthorizeHandler();
                userInfo = await alib.getAuthorizeTokenInfo(db, token);
            }            
            if(userInfo) {                
                let dh = await this.getUserDiffie(userInfo,false,true);
                if(dh) {
                    let publickey = context.params.publickey;
                    if(publickey) {
                        dh.otherPublicKey = publickey;
                        dh.computeSharedKey();
                    }
                    userInfo.prime = dh.prime;
                    userInfo.generator = dh.generator;
                    userInfo.privatekey = dh.privateKey;
                    userInfo.publickey = dh.publicKey;
                    userInfo.otherkey = dh.otherPublicKey;
                    userInfo.sharedkey = dh.sharedKey;
                    userInfo.tokenstatus = "C";
                    let session : any = context.meta?.session;
                    if(session) {
                        //session.dh = dh;
                        session.user = userInfo;
                    }
                    context.meta.user = userInfo;
                    result = await this.saveDiffie(db, userInfo, dh, context);
                }
            }
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
        return this.createRecordSet(result);
    }

    public async encrypt(context: KnContextInfo) : Promise<any> {
        let body: any = { };    
        let plaintext = context.params.plaintext;
        let session: any = context.meta?.session;
        let dh = null;
        if(session && session.hasOwnProperty("dh")) {
            dh = new DH();
            let diffie = session.dh as DH;        
            dh.prime = diffie.prime;
            dh.generator = diffie.generator;
            dh.privateKey = diffie.privateKey;
            dh.publicKey = diffie.publicKey;
            dh.sharedKey = diffie.sharedKey;
            dh.otherPublicKey = diffie.otherPublicKey;
        } else {
            dh = await this.getUserDH(context);
        }
        if(dh && plaintext) {
            body.plaintext = plaintext;
            let enctext = dh.encrypt(plaintext);
            console.log("encrypt text",enctext);
            body.ciphertext = enctext;
            return Promise.resolve(body);
        }
        return Promise.reject("Diffie info not found");
    }

    public async decrypt(context: KnContextInfo) : Promise<any> {
        let body: any = { };    
        let ciphertext = context.params.ciphertext;
        let session: any = context.meta?.session;
        let dh = null;
        if(session && session.hasOwnProperty("dh")) {
            dh = new DH();
            let diffie = session.dh as DH;        
            dh.prime = diffie.prime;
            dh.generator = diffie.generator;
            dh.privateKey = diffie.privateKey;
            dh.publicKey = diffie.publicKey;
            dh.sharedKey = diffie.sharedKey;
            dh.otherPublicKey = diffie.otherPublicKey;
        } else {
            dh = await this.getUserDH(context);
        }
        if(dh && ciphertext) {
            let dectext = dh.decrypt(ciphertext);
            console.log("decrypt text",dectext);
            body.plaintext = dectext;
            body.ciphertext = dh.encrypt(dectext);
            return Promise.resolve(body);
        }
        return Promise.reject("Diffie info not found");
    }

}
