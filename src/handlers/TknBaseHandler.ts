import os from "os";
import { KnHandler, KnModel, KnSetting } from "@willsofts/will-db";
import { KnResultSet, KnSQL, KnDBConnector, KnRecordSet } from '@willsofts/will-sql';
import { AuthenToken, AuthenTokenData, PasswordLibrary, UserTokenInfo } from "@willsofts/will-lib";
import { DH } from "@willsofts/will-dh";
import { Utilities } from "@willsofts/will-util";
import { HTTP, JSONReply } from "@willsofts/will-api";
import { KnAccessor } from '../models/KnAccessor';
import { VerifyError } from "../models/VerifyError";
import { KnAuthorizationInfo, KnContextInfo, KnValidateInfo, RESERVED_FIELDS } from '../models/KnCoreAlias';
import { VALIDATE_TOKEN, DB_SECTION } from "../utils/EnvironmentVariable";

export class TknBaseHandler extends KnHandler {
    public accessor?: KnAccessor;
    public section: string = DB_SECTION;
    
    constructor(model?: KnModel, settings?: KnSetting, accessor?: KnAccessor) {
        super(model, settings);
        this.accessor = accessor;
    }

    protected async getAccessor(conn: KnDBConnector, useruuid: string) : Promise<KnAccessor | undefined> {
        if(useruuid && useruuid.trim().length>0) {
            let sql = new KnSQL("select tusertoken.useruuid,tusertoken.userid,tusertoken.authtoken,tuserinfo.* ");
            sql.append("from tusertoken ");
            sql.append("left join tuserinfo on tuserinfo.userid = tusertoken.userid ");
            sql.append("where tusertoken.useruuid = ?useruuid ");
            sql.set("useruuid",useruuid);
            this.logger.info(this.constructor.name+".getAccessor",sql);
            let rs = await sql.executeQuery(conn);
            if(rs && rs.rows.length>0) {
                let row = rs.rows[0];
                let info = {...row};
                delete info.useruuid;
                delete info.userid;
                delete info.authtoken;
                return Promise.resolve(new KnAccessor(row.useruuid, row.userid, row.authtoken, info));
            }
        }
        return Promise.resolve(undefined);
    }

    protected async retainAccessor(conn: KnDBConnector, useruuid: string) {
        try {
            this.accessor = await this.getAccessor(conn, useruuid);
        } catch(ex) {
            this.logger.error(this.constructor.name,ex);
        }
    }

    protected getHeaderParameter(context: KnContextInfo, parameterName: string) : string | undefined {
        let result = undefined;
        if(context) {     
            if(context.meta.headers) {
                result = context.meta.headers[parameterName];
            }
            if(context.params && context.params.req) {
                result = context.params.req.headers[parameterName];
            }
            if(context.options && context.options.parentCtx && context.options.parentCtx.params && context.options.parentCtx.params.req) {
                result = context.options.parentCtx.params.req.headers[parameterName];
            }
        }        
        return result;
    }

    protected override isInPageSetting(key: string, model: KnModel) : boolean {
        let result = RESERVED_FIELDS.includes(key);
        return result?result:super.isInPageSetting(key, model);
    }
    
    public getCurrentUser() : string {
        return os.userInfo().username;
    }

    public getAuthorizationInfo(context: KnContextInfo) : KnAuthorizationInfo | undefined {
        if(context) {     
            if(context.meta.headers && context.meta.headers.authorization) {
                return {authorization: context.meta.headers.authorization, client: context.meta.headers.client };
            }
            if(context.params && context.params.req && context.params.req.headers && context.params.req.headers.authorization) {
                return {authorization: context.params.req.headers.authorization, client: context.params.req.headers.client };
            }
            if(context.options && context.options.parentCtx && context.options.parentCtx.params 
            && context.options.parentCtx.params.req && context.options.parentCtx.params.req.headers && context.options.parentCtx.params.req.headers.authorization) {
                return { authorization: context.options.parentCtx.params.req.headers.authorization, client: context.options.parentCtx.params.req.headers.client };
            }
        }
        return undefined;
    }

    public getTokenKey(context: KnContextInfo) : string | undefined {
        let token = undefined;   
        if(context) {     
            if(context.meta.headers) {
                token = context.meta.headers.authtoken || context.meta.headers.tokenkey;
                if(token) return token;
            }
            if(context.params && context.params.req) {
                token = context.params.req.headers.authtoken || context.params.req.headers.tokenkey;
                if(token) return token;
            }
            if(context.options && context.options.parentCtx && context.options.parentCtx.params && context.options.parentCtx.params.req) {
                token = context.options.parentCtx.params.req.headers.authtoken || context.options.parentCtx.params.req.headers.tokenkey;
                if(token) return token;
            }
            if(context.params && context.params.authtoken) {
                token = context.params.authtoken || context.params.tokenkey;
                if(token) return token;
            }
        }
        return token;
    }

    public async getUserTokenInfo(context: KnContextInfo, onlyMeta: boolean = false, db?: KnDBConnector) : Promise<UserTokenInfo | undefined> {
        if(context && context.meta) {
            if (context.meta.user && context.meta.user.tokenstatus=="C") {
                return Promise.resolve(context.meta.user);
            }
            if (context.meta.session && context.meta.session.user && context.meta.session.user.tokenstatus=="C") {
                return Promise.resolve(context.meta.session.user);
            }
        }
        let result = undefined;
        if(!onlyMeta) {
            result = await this.getUserTokenInfoByToken(context, db);
            if(result) {
                context.meta.user = result;
                context.meta.session.user = result;
            }
        }
        if(!result) {
            let token = await this.getAuthenToken(context, false, false);
            if(token) {
                result = { useruuid : token.identifier, userid: token.accessor, site: token.site };
            }
        }
        return Promise.resolve(result);
    }

    public async getUserTokenInfoByToken(context: KnContextInfo, db?: KnDBConnector) : Promise<UserTokenInfo | undefined> {
        let token = this.getTokenKey(context);
        if(token && token!="") {
            let plib = new PasswordLibrary();
            if(db) {
                return await plib.getUserTokenInfoByToken(db, token);
            }
            let dbc = null;
            try {
                dbc = this.getConnector(this.section);
                return await plib.getUserTokenInfoByToken(dbc, token);
            } finally {
                if(dbc) dbc.close();    
            }
        }
        return Promise.resolve(undefined);
    }

    public async getUserDiffie(userInfo: UserTokenInfo | undefined, verifyHandShaked: boolean = false, uncheckTokenStatus: boolean = false) : Promise<DH | undefined> {
        if(userInfo && userInfo.prime && userInfo.generator && userInfo.publickey && userInfo.privatekey && userInfo.sharedkey && userInfo.otherkey) {
            let valid = userInfo.tokenstatus == "C";
            if(uncheckTokenStatus) valid = true;
            if(valid) {
                let dh = new DH();
                dh.prime = userInfo.prime;
                dh.generator = userInfo.generator;
                dh.privateKey = userInfo.privatekey;
                dh.publicKey = userInfo.publickey;
                dh.sharedKey = userInfo.sharedkey;
                dh.otherPublicKey = userInfo.otherkey;
                return Promise.resolve(dh);
            } 
            if(verifyHandShaked && (userInfo.tokenstatus === null || userInfo.tokenstatus === undefined)) {
                return Promise.reject(new VerifyError("Token does not handshaked",HTTP.NOT_ALLOWED,-16008));
            }            
        }
        return Promise.resolve(undefined);
    }

    public async getUserDH(context: KnContextInfo, verifyHandShaked: boolean = false, uncheckTokenStatus: boolean = false) : Promise<DH | undefined> {
        let token = await this.getUserTokenInfo(context);
        let dh = await this.getUserDiffie(token,verifyHandShaked,uncheckTokenStatus);
        return Promise.resolve(dh);
    }
    
    public async getAuthenToken(context: KnContextInfo, verifyTokenKey: boolean = true, verifyIdentifier: boolean = true) : Promise<AuthenTokenData | undefined> {
        let token = this.getTokenKey(context);
        return await this.verifyAuthenToken(token, verifyTokenKey, verifyIdentifier);
    }
    
    public async verifyAuthenToken(token?: string, verifyTokenKey: boolean = true, verifyIdentifier: boolean = true) : Promise<AuthenTokenData | undefined> {
        if (token != undefined) {
            const atoken: AuthenTokenData = AuthenToken.verifyAuthenToken(token as string, false);
            if (verifyIdentifier && (atoken.identifier == undefined)) {
                return Promise.reject(new VerifyError("Token is invalid",HTTP.UNAUTHORIZED,-16001));
            }
            return Promise.resolve(atoken);
        }
        if(verifyTokenKey) {
            return Promise.reject(new VerifyError("Token undefined",HTTP.UNAUTHORIZED,-16002));
        }        
        return Promise.resolve(undefined);
    }

    public async exposeContext(context: KnContextInfo, includeChiperData: boolean = true) : Promise<KnContextInfo> {
        if(this.isCipherData(context)) {
            let dh = await this.getUserDH(context);
            if(dh) {
                let ciphertext = context.params.ciphertext;
                this.logger.debug(this.constructor.name+".exposeContext: ciphertext",ciphertext);
                if(ciphertext && ciphertext!="") {
                    let jsonstr = dh.decrypt(ciphertext);
                    this.logger.debug(this.constructor.name+".exposeContext",jsonstr);
                    if(jsonstr && jsonstr!="") {
                        let json = JSON.parse(jsonstr);
                        if(!includeChiperData) {
                            delete context.params.ciphertext;
                        }
                        context.params = { ...context.params, ...json };
                    }
                }
            }        
        }
        return Promise.resolve(context);
    }

    public isCipherData(context: KnContextInfo) : boolean {
        let result = this.getHeaderParameter(context, "data-type");
        return result=="json/cipher";
    }

    public isCipherText(context: KnContextInfo) : boolean {
        let result = this.getHeaderParameter(context, "data-type");
        return result=="text/cipher";
    }

    public isCipherDataAccept(context: KnContextInfo) : boolean {
        let result = this.getHeaderParameter(context, "accept-type");
        return result=="json/cipher";
    }

    public isCipherTextAccept(context: KnContextInfo) : boolean {
        let result = this.getHeaderParameter(context, "accept-type");
        return result=="text/cipher";
    }

    /**
     * try to encrypt data if found user DH
     * @param context 
     * @param data 
     * @returns cipher string
     */
    public async encryptData(context: KnContextInfo, data?: any, verifyHandShaked: boolean = false) : Promise<any> {
        if(data) {
            let dh = await this.getUserDH(context,verifyHandShaked);
            if(dh) {
                return Promise.resolve(dh.encrypt(JSON.stringify(data)));
            }
        }
        return Promise.resolve(data);        
    }

    /**
     * try to encrypt data when header accept-type is json/cipher
     * @param context 
     * @param data 
     * @returns json format { data: ? } 
     */
    public async cipherData(context: KnContextInfo, data?: any, verifyHandShaked: boolean = false) : Promise<any> {
        if(data && this.isCipherDataAccept(context)) {
            let dh = await this.getUserDH(context,verifyHandShaked);
            if(dh) {
                return Promise.resolve({data: dh.encrypt(JSON.stringify(data)) });
            }
        }
        return Promise.resolve(data);
    }

    /**
     * try to encrypt data when header accept-type is text/cipher
     * @param context 
     * @param data 
     * @returns cipher string
     */
    public async cipherText(context: KnContextInfo, data?: any, verifyHandShaked: boolean = false) : Promise<any> {
        if(data && this.isCipherTextAccept(context)) {
            let dh = await this.getUserDH(context,verifyHandShaked);
            if(dh) {
                return Promise.resolve(dh.encrypt(JSON.stringify(data)));
            }
        }
        return Promise.resolve(data);
    }

    public createJSONReply(method: string, data?: any, model?: string) : JSONReply {
        let reply : JSONReply = new JSONReply();
        reply.head.modeling(model?model:this.constructor.name, method);
        reply.head.composeNoError();
        reply.body = data;
        return reply;
    }

    public async createCipherData(context: KnContextInfo, method: string, data?: any, verifyHandShaked: boolean = true, model?: string) : Promise<any> {
        if(this.isCipherDataAccept(context)) {
            return this.cipherData(context, data, verifyHandShaked);
        } else if(this.isCipherTextAccept(context)) {
            let result = await this.cipherText(context, this.createJSONReply(method, data, model), verifyHandShaked);
            if(Utilities.isString(result)) {
                context.meta.$responseRaw = true; 
                if(!context.meta.$responseType) {
                    context.meta.$responseType = "text/plain";
                }
            }
            return result;
        }
        return Promise.resolve(data);
    }

    public async validateAuthenToken(context: KnContextInfo) : Promise<AuthenTokenData | undefined> {
        if(!VALIDATE_TOKEN) return Promise.resolve(undefined);
        let authtoken = await this.getAuthenToken(context, true, true);
        return Promise.resolve(authtoken);
    }

    public validateParameters(params: any, ...args: string[]) : KnValidateInfo {
        if(args && args.length>0) {
            for(let i=0,isz=args.length;i<isz;i++) {
                let name = args[i];
                let value = params[name];
                if(value==undefined || value==null || value=="") {
                    return {valid:false, info: name};
                }
            }
        }
        return {valid: true};
    }

    public recordNotFound() : Promise<any> {
        return Promise.reject(new VerifyError("Record not found",HTTP.NOT_FOUND,-16004));
    }
    
    public notImplementation() : Promise<any> {
        return Promise.reject(new VerifyError("Not implemented",HTTP.NOT_IMPLEMENTED,-16005));
    }
    
    public createRecordSet(result: KnResultSet = {rows: [], columns: null}) : KnRecordSet {
        let records = 0;
        if(result.rows) {
            if(Array.isArray(result.rows)) {
                records = result.rows.length;
            } else {
                if(result.rows.affectedRows) {
                    records = result.rows.affectedRows;
                }
            }
        } 
        return {records: records, rows: result.rows, columns: null, offsets: result.offsets };
    }
    
    public async call(serviceName: string, params: any, options?: any) : Promise<any> {
        return this.broker?.call(serviceName, params, options);
    }

}
