import { v4 as uuid } from 'uuid';
import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnSQL, KnRecordSet, KnResultSet } from '@willsofts/will-sql';
import { HTTP } from "@willsofts/will-api";
import { Utilities } from "@willsofts/will-util";
import { TknSchemeHandler } from "./TknSchemeHandler";
import { VerifyError } from "../models/VerifyError";
import { KnContextInfo, KnValidateInfo, KnFactorInfo, KnFactorConfigInfo, KnFactorTokenInfo, KnFactorVerifyInfo } from "../models/KnCoreAlias";
import { generateSecret, generateToken, verifyToken } from "node-2fa";

export class TknTwoFactorHandler extends TknSchemeHandler {
    public model : KnModel = { name: "tuserfactor", alias: { privateAlias: this.section } };
    public handlers = [ {name: "get"}, {name: "generate"}, {name: "verify"}, {name: "confirm"} ];
    public factorInfo : KnFactorInfo | undefined;

    public async generate(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: "generate", raw: false}, this.doGenerate);
    }

    public async verify(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: "verify", raw: false}, this.doVerify);
    }

    public async confirm(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: "verify", raw: false}, this.doConfirm);
    }

    public createFactorInfo(data: any) : KnFactorInfo {
        let email = (data?.email && data.email.trim().length>0)?data?.email:"";
        let factorissuer = (data?.issuer && data.issuer.trim().length>0)?data?.issuer:"Smart2FA";
        let secret = generateSecret({name: factorissuer, account: email});
        this.factorInfo = {
            factorconfig: false, factorfound: false,
            factorverify: data?.factorverify || false,
            issuer: factorissuer,
            userid: (data?.userid && data.userid.trim().length>0)?data?.userid:"",
            factorid: (data?.factorid && data.factorid.trim().length>0)?data?.factorid:uuid(),
            factorflag: (data?.factorflag && data.factorflag.trim().length>0)?data?.factorflag:"0",
            factorkey: secret.secret,
            factorurl: secret.uri,
            factorremark: secret.qr,
            email: email,
        }
        return this.factorInfo;
    }

    public async genterateFactor(info: KnFactorInfo) : Promise<KnFactorTokenInfo> {
        let token = generateToken(info.factorkey);
        if(token) {
            return {valid: true, token: token.token};
        }
        return {valid: false, token: ""};
    }

    public async verifyFactor(info: KnFactorInfo, factorcode: string) : Promise<KnFactorVerifyInfo> {
        let result = verifyToken(info.factorkey, factorcode);
        if(result) {
            return { verified: true, delta: result.delta };
        }
        return {verified: false, delta: -1};
    }

    public composeFactorUri(info: any) : string {
        return "otpauth://totp/"+encodeURIComponent(info.name+":"+info.account)+"?secret="+encodeURIComponent(info.secret)+"&issuer="+encodeURIComponent(info.name);
    }

    public async doGenerate(context: KnContextInfo, model: KnModel) : Promise<KnFactorTokenInfo> {
        let info = await this.doGet(context, model);
        if(info && info.factorfound) {
            return this.genterateFactor(info);
        }
        return this.recordNotFound();
    }

    public async doGenerating(context: KnContextInfo, db: KnDBConnector, findByUser: boolean = false) : Promise<KnFactorTokenInfo> {
        await this.validateRequireFields(context, this.model, "generate");
        let info = await this.getFactorInfo(db, context.params.factorid, findByUser, context);
        if(info && info.factorfound) {
            return this.genterateFactor(info);
        }
        return {valid: false, token: ""};
    }

    public async doVerify(context: KnContextInfo, model: KnModel) : Promise<KnFactorVerifyInfo> {
        let vi = this.validateParameters(context.params,"factorcode");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        let info = await this.doGet(context, model);
        if(info && info.factorfound) {
            return this.verifyFactor(info, context.params.factorcode);
        }
        return this.recordNotFound();
    }

    public async doVerifying(context: KnContextInfo, db: KnDBConnector, findByUser: boolean = false): Promise<KnFactorVerifyInfo> {
        await this.validateRequireFields(context, this.model, KnOperation.VERIFY);
        let info = await this.getFactorInfo(db, context.params.factorid, findByUser, context);
        if(info && info.factorfound) {
            return this.verifyFactor(info, context.params.factorcode);
        }
        return {verified: false, delta: -1};
    }

    public async doGet(context: KnContextInfo, model: KnModel) : Promise<KnFactorInfo> {
        await this.validateRequireFields(context, model, KnOperation.GET);
        let db = this.getPrivateConnector(model);
        try {
            let info = await this.getFactorInfo(db, context.params.factorid, false, context);
            return await this.createCipherData(context, KnOperation.GET, info);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    public async doConfirm(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        await this.validateRequireFields(context, model, KnOperation.UPDATE);
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.doConfirming(context, db);
            return await this.createCipherData(context, KnOperation.UPDATE, rs);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    public async doConfirming(context: KnContextInfo, db: KnDBConnector): Promise<KnRecordSet> {
        let userToken = await this.getUserTokenInfo(context, true);
        await this.updateUserFactor(db, userToken?.useruuid as string, context.params.factorcode, context);
        return await this.confirmFactor(db, context.params.factorid, userToken?.userid, context);
    }

    public validateRequireFields(context: KnContextInfo, model: KnModel, action?: string) : Promise<KnValidateInfo> {
        let vi = this.validateParameters(context.params,"factorid");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        return Promise.resolve(vi);
    }

    public override async doRetrieve(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        await this.validateRequireFields(context, model, KnOperation.RETRIEVE);
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.doRetrieving(context, db);
            return await this.createCipherData(context, KnOperation.RETRIEVE, rs);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    public async doRetrieving(context: KnContextInfo, db: KnDBConnector): Promise<KnRecordSet> {
        return await this.performRetrieving(db, context.params.factorid, false, context);
    }

    public async performRetrieving(db: KnDBConnector, id: string, findByUser: boolean = true, context?: any): Promise<KnRecordSet> {
        if(!id || id.trim().length==0) return this.createRecordSet();
        let knsql = new KnSQL();
        knsql.append("select * from tuserfactor ");
        if(findByUser)  {
            knsql.append("where userid=?userid ");
            knsql.set("userid",id);
        } else {
            knsql.append("where factorid=?factorid ");
            knsql.set("factorid",id);
        }
        this.logger.debug(this.constructor.name+".performRetrieving",knsql);
        let rs = await knsql.executeQuery(db,context);
        return this.createRecordSet(rs);
    }

    public async getFactorInfo(db: KnDBConnector, id: string, findByUser: boolean = true, context?: any): Promise<KnFactorInfo> {
        let cfg = await this.getConfigure(db,context);
        let rs = await this.performRetrieving(db, id, findByUser,context);
        if(rs && rs.rows.length>0) {
            let row = rs.rows[0];
            let factorurl = this.composeFactorUri({name: row.issuer, account: row.email, secret: row.factorkey});
            return { 
                factorfound: true,
                factorconfig: cfg?.factorconfig || false,
                factorverify: cfg?.factorverify || false,
                issuer: row.issuer || cfg?.issuer,
                userid : row.userid,
                factorid: row.factorid, factorkey: row.factorkey, 
                factorflag: row.factorflag, email: row.email,
                factorurl: factorurl, factorremark: row.factorremark 
            };
        }
        return {...cfg, userid: findByUser?id:"", email: "", factorfound: false, factorid: "", factorkey: "", factorflag: ""};
    }

    public async getConfigure(db: KnDBConnector, context?: any): Promise<KnFactorConfigInfo> {
        let result : KnFactorConfigInfo = { factorconfig: false, factorverify: false, issuer: "" };
        let knsql = new KnSQL();
        knsql.append("select * from tconfig where category='2FA' ");
        let rs = await knsql.executeQuery(db,context);
        if(rs && rs.rows.length>0) {
            for(let row of rs.rows) {
                if(Utilities.equalsIgnoreCase("FACTORVERIFY",row.colname)) {
                    result.factorverify = Utilities.equalsIgnoreCase("true",row.colvalue);
                    result.factorconfig = true;
                } else if(Utilities.equalsIgnoreCase("FACTORISSUER",row.colname)) {
                    result.issuer = row.colvalue;
                    result.factorconfig = true;
                }
            }
        }
        return result;
    }

    public override async doCreate(context: KnContextInfo, model: KnModel) : Promise<KnFactorInfo> {
        let vi = this.validateParameters(context.params,"userid","email");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        await this.doCreating(context, model);
        return await this.createCipherData(context, KnOperation.CREATE, this.factorInfo);
    }

    public override async doClear(context: KnContextInfo, model: KnModel) : Promise<KnResultSet> {
        await this.validateRequireFields(context, model, KnOperation.CLEAR);
        let rs = await this.doClearing(context, model);
        return await this.createCipherData(context, KnOperation.CLEAR, rs);
    }

    public override async doInsert(context: KnContextInfo, model: KnModel) : Promise<KnFactorInfo> {
        return this.doCreate(context, model);
    }

    public override async doUpdate(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        return this.doConfirm(context, model);
    }
    
    public override async doRemove(context: KnContextInfo, model: KnModel) : Promise<KnResultSet> {
        return this.doClear(context, model);
    }

    public override async performCreating(context: any, model: KnModel, db: KnDBConnector): Promise<KnResultSet> {
        let info = await this.performCreateFactor(context, db, context.params);
        return { rows: [info], columns: null };
    }

    public async performCreateFactor(context: any, db: KnDBConnector, data: any): Promise<KnFactorInfo> {
        let userToken = await this.getUserTokenInfo(context, true);
        let info = this.createFactorInfo(data);
        await this.createFactor(db, info, userToken?.userid);
        return info;
    }

    public override async performClearing(context: any, model: KnModel, db: KnDBConnector): Promise<KnResultSet> {
        return this.deleteFactor(db, context.params.factorid);
    }

    public async createFactor(db: KnDBConnector, info: KnFactorInfo, edituser?: string, context?: any): Promise<KnRecordSet> {
        let now = Utilities.now();
        let knsql = new KnSQL();
        knsql.append("insert into tuserfactor(factorid,userid,factorkey,email,issuer,factorflag,factorurl,");
        knsql.append("createdate,createtime,createtranstime,editdate,edittime,edituser,factorremark) ");
        knsql.append("values(?factorid,?userid,?factorkey,?email,?issuer,?factorflag,?factorurl,");
        knsql.append("?createdate,?createtime,?createtranstime,?editdate,?edittime,?edituser,?factorremark) ");
        knsql.set("factorid",info.factorid);
        knsql.set("userid",info.userid);
        knsql.set("factorkey",info.factorkey);
        knsql.set("email",info.email);
        knsql.set("issuer",info.issuer);
        knsql.set("factorflag",info.factorflag);
        knsql.set("factorurl",info.factorurl);
        knsql.set("createdate",now, "DATE");
        knsql.set("createtime",now, "TIME");
        knsql.set("createtranstime",now.getTime());
        knsql.set("editdate",now, "DATE");
        knsql.set("edittime",now, "TIME");
        knsql.set("edituser",edituser);
        knsql.set("factorremark",info.factorremark);
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);
    }

    public async deleteFactor(db: KnDBConnector, factorid: string, context?: any): Promise<KnRecordSet> {
        await this.moveToHistory(db, factorid, context);
        return this.removeFactor(db, factorid, context);
    }

    public async removeFactor(db: KnDBConnector, factorid: string, context?: any): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("delete from tuserfactor ");
        knsql.append("where factorid = ?factorid ");
        knsql.set("factorid", factorid);
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);        
    }

    public async moveToHistory(db: KnDBConnector, factorid: string, context?: any): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("insert into tuserfactorhistory ");
        knsql.append("select * from tuserfactor  ");
        knsql.append("where factorid = ?factorid ");
        knsql.set("factorid", factorid);
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);
    }

    public async confirmFactor(db: KnDBConnector, factorid: string, edituser?: string, context?: any): Promise<KnRecordSet> {
        let now = Utilities.now();
        let knsql = new KnSQL();
        knsql.append("update tuserfactor set factorflag = '1' ");
        knsql.append(", confirmdate=?confirmdate, confirmtime=?confirmtime ");
        knsql.append(", confirmtranstime=?confirmtranstime ");
        knsql.append(", editdate=?editdate, edittime=?edittime, edituser=?edituser ");
        knsql.append("where factorid = ?factorid ");
        knsql.set("factorid", factorid);
        knsql.set("confirmdate",now, "DATE");
        knsql.set("confirmtime",now, "TIME");
        knsql.set("confirmtranstime",now.getTime());
        knsql.set("editdate",now, "DATE");
        knsql.set("edittime",now, "TIME");
        knsql.set("edituser",edituser);
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);
    }

    public async updateUserFactor(db: KnDBConnector, useruuid: string, factorcode: string, context?: any): Promise<KnRecordSet> {
        if(!useruuid || useruuid.trim().length==0) return this.createRecordSet();
        let knsql = new KnSQL();
        knsql.append("update tusertoken set factorcode = ?factorcode ");
        knsql.append("where useruuid = ?useruuid ");
        knsql.set("factorcode",factorcode);
        knsql.set("useruuid", useruuid);
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);
    }

}
