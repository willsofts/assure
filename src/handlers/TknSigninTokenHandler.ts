import { v4 as uuid } from 'uuid';
import { KnModel } from "@willsofts/will-db";
import { AuthenTokenData } from '@willsofts/will-lib';
import { HTTP } from "@willsofts/will-api";
import { KnSQL, KnDBConnector, KnResultSet } from '@willsofts/will-sql';
import { Utilities } from "@willsofts/will-util";
import { AuthenToken } from '@willsofts/will-lib';
import { EXPIRE_TIMES } from "../utils/EnvironmentVariable";
import { KnUserToken } from "../models/KnUserToken";
import { VerifyError } from '../models/VerifyError';
import { KnContextInfo, KnDiffieInfo, KnUserAccessInfo, KnAccessingInfo, KnFactorInfo } from '../models/KnCoreAlias';
import { TknSchemeHandler } from './TknSchemeHandler';
import { TknTwoFactorHandler } from './TknTwoFactorHandler';
import { TknDiffieHandler } from './TknDiffieHandler';

export class TknSigninTokenHandler extends TknSchemeHandler {
    public model : KnModel = { name: "tuser", alias: { privateAlias: this.section } };

    //declared addon actions name
    public handlers = [ {name: "account"}, {name: "accesstoken"}, {name: "fetchtoken"}, {name: "validatetoken"}, {name: "removetoken"}, {name: "renewtoken"} ];

    public async account(context: KnContextInfo) : Promise<Map<string,Object>> {
        return this.callFunctional(context, {operate: "account", raw: false}, this.doAccountToken);
	}

    public async accesstoken(context: KnContextInfo) : Promise<Map<string,Object>> {
        return this.callFunctional(context, {operate: "accesstoken", raw: false}, this.doAccessToken);
	}

    public async fetchtoken(context: KnContextInfo) : Promise<Map<string,Object>> {
        return this.callFunctional(context, {operate: "fetchtoken", raw: false}, this.doFetchToken);
	}

    public async removetoken(context: KnContextInfo) : Promise<Map<string,Object>> {
        return this.callFunctional(context, {operate: "removetoken", raw: false}, this.doRemoveToken);
	}

    public async renewtoken(context: KnContextInfo) : Promise<Map<string,Object>> {
        return this.callFunctional(context, {operate: "renewtoken", raw: false}, this.doRenewToken);
	}

    public async validatetoken(context: KnContextInfo) : Promise<AuthenTokenData | undefined> {
        await this.exposeFunctional(context, this.model, {operate:"validatetoken"});
        return this.getAuthenToken(context, true, true, false);
	}

    protected async doAccessToken(context: KnContextInfo, model: KnModel = this.model) : Promise<Map<string,Object>> {
        let token = this.getTokenKey(context);
        this.logger.debug(this.constructor.name+".doAccessToken: token = "+token);
        if(!token || token=="") {
            return Promise.reject(new VerifyError("Invalid access token",HTTP.NOT_ACCEPTABLE,-3010));	
        }
        await this.verifyAuthenToken(token);
        let db = this.getPrivateConnector(model);
        try {
            let body = await this.processAccessToken(db, token, false, context);
            this.updateUserAccessing(context, { userid: body.get("userid") as string }, model);
            return body;
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

    protected async doFetchToken(context: KnContextInfo, model: KnModel = this.model) : Promise<Map<string,Object>> {
        let puuid = context.params.useruuid;
        this.logger.debug(this.constructor.name+".doFetchToken: useruuid = "+puuid);
        if(!puuid || puuid=="") {
            return Promise.reject(new VerifyError("Invalid access user",HTTP.NOT_ACCEPTABLE,-3010));	
        }
        let db = this.getPrivateConnector(model);
        try {
            let body = await this.processAccessToken(db, puuid, true);
            this.updateUserAccessing(context, { userid: body.get("userid") as string }, model);
            return body;
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

    protected async doRemoveToken(context: KnContextInfo, model: KnModel = this.model) : Promise<KnResultSet> {
        let authtoken = context.params.authtoken;
        if(!authtoken || authtoken=="") {
            authtoken = this.getTokenKey(context);
        }
        this.logger.debug(this.constructor.name+".doRemoveToken: authtoken = "+authtoken);
        if(!authtoken || authtoken=="") {
            return Promise.reject(new VerifyError("Invalid access token",HTTP.NOT_ACCEPTABLE,-3010));	
        }
        let db = this.getPrivateConnector(model);
        try {
            return await this.deleteTokenByToken(db, authtoken, context);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

    protected async doRenewToken(context: KnContextInfo, model: KnModel = this.model) : Promise<Map<string,Object>> {
        let state = context.params.state;
        let nonce = context.params.nonce;
        let authtoken = context.params.authtoken;
        if(!authtoken || authtoken=="") {
            authtoken = this.getTokenKey(context);
        }
        this.logger.debug(this.constructor.name+".doRenewToken: authtoken = "+authtoken);
        if(!authtoken || authtoken=="") {
            return Promise.reject(new VerifyError("Invalid access token",HTTP.NOT_ACCEPTABLE,-3010));	
        }
        let userdata = await this.verifyAuthenToken(authtoken);
        if(!userdata) {
            return Promise.reject(new VerifyError("Invalid access token",HTTP.NOT_ACCEPTABLE,-3012));	
        }
        if((!state || state=="") || (!nonce || nonce=="")) {
            return Promise.reject(new VerifyError("Invalid access state or nonce",HTTP.NOT_ACCEPTABLE,-3013));	
        }
        let db = this.getPrivateConnector(model);
        try {
            let authdata = {identifier:userdata?.identifier, site:userdata?.site, accessor:userdata?.accessor, type: "S"};
            let body = this.createChangingToken(authdata);
            await this.changeUserToken(db, authdata, state, nonce, body.get("authtoken") as string, body.get("expiretimes") as number, context);
            return body;
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }
    
    public createChangingToken(authdata: AuthenTokenData, expireins: number = EXPIRE_TIMES) : Map<string,Object> {
        let newtoken : string = AuthenToken.createAuthenToken(authdata);
        let body : Map<string,Object> = new Map();
        let now = new Date();
        let expiretimes : number = now.getTime() + expireins;
        let expdate = new Date(expiretimes);
        body.set("expiretimes",expiretimes);
        body.set("expireddate",Utilities.currentDate(expdate)+" "+Utilities.currentTime(expdate));
        body.set("authtoken",newtoken);
        return body;
    }

    public async createDiffie(context: KnContextInfo, db: KnDBConnector, token: KnUserToken) : Promise<KnDiffieInfo | undefined> {
        let handler : TknDiffieHandler = new TknDiffieHandler();
        let dh = await handler.createDiffie(context);
        console.log(this.constructor.name+".createDiffie",dh);
        await handler.saveDiffie(db, {useruuid: token.useruuid }, dh, context);
        let info = handler.createDiffieInfo(dh);
        return Promise.resolve(info);
    }

    public async processTwoFactor(context: KnContextInfo, db: KnDBConnector, row: any) : Promise<KnFactorInfo> {
        let handler = new TknTwoFactorHandler();
        let info = await handler.getFactorInfo(db, row.userid, true);
        if(info.factorverify && !info.factorfound && info.factorid.trim().length==0) {
            info.userid = row.userid;
            info.email = row.email;
            info = await handler.performCreateFactor(context, db, info);
        }
        return info;
    }

    public async processAccessToken(db: KnDBConnector, useruuid: string, fetching: boolean = true, context?: any) : Promise<Map<string,Object>> {
        let body : Map<string,Object> = new Map();
        let now = new Date();
        let sql = new KnSQL("select tuser.userid,tuser.username,tuser.userpassword,tuser.passwordexpiredate,tuser.site,");
        sql.append("tuser.accessdate,tuser.accesstime,tuser.changeflag,tuser.newflag,tuser.loginfailtimes,tuser.failtime,tuser.lockflag,tuser.firstpage,");
        sql.append("tuserinfo.userename,tuserinfo.useresurname,tuserinfo.email,tuserinfo.displayname,tuserinfo.langcode,tuserinfo.activeflag,tuserinfo.usercontents,");
        sql.append("tusertoken.expiretimes,tusertoken.code,tusertoken.state,tusertoken.nonce,tusertoken.authtoken,tusertoken.accesscontents,");
        sql.append("tusertoken.prime,tusertoken.generator,tusertoken.publickey,tusertoken.useruuid,tusertoken.factorcode ");
        sql.append("from tusertoken,tuser,tuserinfo ");
        if(fetching) {
            sql.append("where tusertoken.useruuid = ?useruuid ");
            sql.set("useruuid",useruuid);
        } else {
            sql.append("where tusertoken.authtoken = ?authtoken ");
            sql.set("authtoken",useruuid);
        }
        sql.append("and tusertoken.expiretimes >= ?expiretimes ");
        sql.append("and tusertoken.outdate is null and tusertoken.outtime is null ");
        sql.append("and tusertoken.userid = tuser.userid ");
        sql.append("and tuser.userid = tuserinfo.userid "); 
        sql.set("expiretimes",now.getTime());
        let rs = await sql.executeQuery(db,context);
        this.logger.debug(this.constructor.name+".processAccessToken: effected "+rs.rows.length+" rows.");
        if(rs.rows && rs.rows.length>0) {
            let row = rs.rows[0];
            let handler = new TknTwoFactorHandler();
            let factorInfo = await handler.getFactorInfo(db, row.userid, true);                
            let token = new KnUserToken(row.useruuid,row.expiretimes,row.code,row.state,row.nonce,row.authtoken);
            let dh = { prime: row.prime, generator: row.generator, publickey: row.publickey };
            let ainfo = {userid: row.userid, email: row.email };
            this.composeResponseBody(body,token,row.username,{...row, ...factorInfo, ...ainfo},false,dh);
        } else {
            return Promise.reject(new VerifyError("Invalid access token",HTTP.NOT_ACCEPTABLE,-3011));
        }
        return Promise.resolve(body);
    }

    public composeResponseBody(body : Map<string,Object>, token: KnUserToken, username: string, row: any, tempmatch: boolean = false, dhinfo?: KnDiffieInfo) : void {
        let expdate = new Date(token.expiretimes);
        let expireflag = "0";
        if(row.passwordexpiredate) {
            let expired = Utilities.compareDate(row.passwordexpiredate, Utilities.now());
            if(expired < 0) {
                expireflag = "1";
            }
        }
        body.set("useruuid",token.useruuid);
        body.set("expiretimes",token.expiretimes);
        body.set("expireddate",Utilities.currentDate(expdate)+" "+Utilities.currentTime(expdate));
        body.set("code",token.code);
        body.set("state",token.state);
        body.set("nonce",token.nonce);
        body.set("authtoken",token.authtoken);
        body.set("username",username);
        body.set("userid",row.userid);
        body.set("name",row.userename);
        body.set("surname",row.useresurname);
        body.set("displayname",row.displayname);
        body.set("email",row.email);
        body.set("site",row.site);
        body.set("accessdate",Utilities.getDMY(row.accessdate));
        body.set("accesstime",Utilities.getHMS(row.accesstime));
        body.set("activeflag",row.activeflag);
        body.set("changeflag",row.changeflag);
        body.set("expireflag",expireflag);
        body.set("newflag",row.newflag);
        body.set("langcode",row.langcode);
        body.set("factorverify", row?.factorverify)
        body.set("factorflag", row?.factorflag);
        body.set("factorid", row?.factorid);
        body.set("factorcode", row?.factorcode);
        body.set("firstpage", row?.firstpage);
        body.set("usercontents",row.usercontents);
        let accessinfo = row.accesscontents;
        if(Utilities.isString(row.accesscontents) && row.accesscontents.trim().length>0) {
            accessinfo = JSON.parse(row.accesscontents);
        }
        body.set("accesscontents",accessinfo);
        if(tempmatch) body.set("changeflag","1");
        if(dhinfo) body.set("info",dhinfo);
    }

    public async createUserAccess(db: KnDBConnector, usrinfo: KnUserAccessInfo, context?: any) : Promise<KnUserToken> {
        let useruuid : string = uuid();
        let authdata = {identifier:useruuid, site:usrinfo.site, accessor:usrinfo.userid, type: "S"};
        let authtoken : string = AuthenToken.createAuthenToken(authdata);
        return this.createUserToken(db, usrinfo, useruuid, authtoken, "S", EXPIRE_TIMES, context);
    }

    public async createUserToken(db: KnDBConnector, usrinfo: KnUserAccessInfo, useruuid: string, authtoken: string, tokentype: string = "S", expireins: number = EXPIRE_TIMES, context?: any) : Promise<KnUserToken> {
        let now = new Date();
        let expiretimes : number = now.getTime() + expireins;
        let expdate = new Date(expiretimes);
        let code = usrinfo.code?usrinfo.code: uuid();
        let state = usrinfo.state?usrinfo.state: uuid();
        let nonce = usrinfo.nonce?usrinfo.nonce: uuid();
        let accesscontents = usrinfo.loginfo?JSON.stringify(usrinfo.loginfo):null;
        let sql = new KnSQL("insert into tusertoken(useruuid,userid,createdate,createtime,createmillis,");
        sql.append("expiredate,expiretime,expiretimes,site,code,state,nonce,authtoken,tokentype,accesscontents) ");
        sql.append("values(?useruuid,?userid,?createdate,?createtime,?createmillis,");
        sql.append("?expiredate,?expiretime,?expiretimes,?site,?code,?state,?nonce,?authtoken,?tokentype,?accesscontents) ");
        sql.set("useruuid",useruuid);
        sql.set("userid",usrinfo.userid);
        sql.set("createdate",now,"DATE");
        sql.set("createtime",now,"TIME");
        sql.set("createmillis",now.getTime());
        sql.set("expiredate",expdate,"DATE");
        sql.set("expiretime",expdate,"TIME");
        sql.set("expiretimes",expiretimes);
        sql.set("site",usrinfo.site);
        sql.set("code",code);
        sql.set("state",state);
        sql.set("nonce",nonce);
        sql.set("authtoken",authtoken);
        sql.set("tokentype",tokentype);
        sql.set("accesscontents",accesscontents);
        let rs = await sql.executeQuery(db,context);
        this.logger.debug(this.constructor.name+".createKnUserToken: affected "+rs.rows.affectedRows+" rows.");
        return Promise.resolve(new KnUserToken(useruuid,expiretimes,code,state,nonce,authtoken));
    }

    public async updateUserAccessing(context: KnContextInfo, info: KnAccessingInfo, model: KnModel = this.model) : Promise<void> {
        if(!info.userid && !info.username) return;
        let db = this.getPrivateConnector(model);
        try {
            if(info.userid) {
                await this.updateUserAccess(db,info.userid,context);
            }
            if(info.username) {
                await this.updateUserLock(db,info.username,info.lockflag as string,context);
            }
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
        } finally {
            if(db) db.close();
        }
    }

    public async updateUserAccess(db: KnDBConnector, userid: string, context?: any) : Promise<void> {
        let now = new Date();
        let sql = new KnSQL("update tuser set accessdate=?accessdate, accesstime=?accesstime, ");
        sql.append("accesshits = accesshits + ?accesshits, mistakens = 0, mistakentime = 0 ");
        sql.append("where userid=?userid ");
        sql.set("accessdate",now,"DATE");
        sql.set("accesstime",now,"TIME");
        sql.set("accesshits",1);
        sql.set("userid",userid);
        this.logger.info(this.constructor.name+".updateUserAccess",sql);
        let rs = await sql.executeUpdate(db,context);
        this.logger.debug(this.constructor.name+".updateUserAccess: affected "+rs.rows.affectedRows+" rows.");
        sql.clear();
        sql.append("update tuserinfo set accessdate=?accessdate, accesstime=?accesstime where userid=?userid ");
        sql.set("accessdate",now,"DATE");
        sql.set("accesstime",now,"TIME");
        sql.set("userid",userid);
        this.logger.info(this.constructor.name+".updateUserAccess",sql);
        rs = await sql.executeUpdate(db,context);
        this.logger.debug(this.constructor.name+".updateUserAccess: affected "+rs.rows.affectedRows+" rows.");
        return Promise.resolve();
    }

    public async updateUserLock(db: KnDBConnector, username: string, lockflag: string, context?: any) : Promise<void> {
        let loginfailtimes = 0;
        let now = new Date();
        let failtime = now.getTime();
        let sql = new KnSQL();
        let locked = "1"==lockflag;
        if(locked) {
            loginfailtimes = 1;
            sql.append("update tuser set loginfailtimes = loginfailtimes + ?loginfailtimes, failtime=?failtime ");
        } else {
            sql.append("update tuser set loginfailtimes=?loginfailtimes, failtime=?failtime ");
            failtime = 0;
        }
        sql.append("where username = ?username ");
        sql.set("loginfailtimes",loginfailtimes);
        sql.set("failtime",failtime);
        sql.set("username",username);
        this.logger.info(this.constructor.name+".updateUserLock",sql);
        let rs = await sql.executeUpdate(db,context);
        this.logger.debug(this.constructor.name+".updateUserLock: affected "+rs.rows.affectedRows+" rows.");
        return Promise.resolve();
    }

    public async deleteTokenByUser(db: KnDBConnector, useruuid: string, context?: any) : Promise<KnResultSet> {
        let sql = new KnSQL("delete from tusertoken where useruuid = ?useruuid ");
        sql.set("useruuid",useruuid);
        this.logger.info(this.constructor.name+".deleteTokenByUser",sql);
        return sql.executeUpdate(db,context);
    }

    public async deleteTokenByToken(db: KnDBConnector, authtoken: string, context?: any) : Promise<KnResultSet> {
        let sql = new KnSQL("delete from tusertoken where authtoken = ?authtoken ");
        sql.set("authtoken",authtoken);
        this.logger.info(this.constructor.name+".deleteTokenByToken",sql);
        return sql.executeUpdate(db,context);
    }

    public async changeUserToken(db: KnDBConnector, authdata: AuthenTokenData, state: string, nonce: string, newtoken: string, expiretimes: number, context?: any) : Promise<KnResultSet> {
        let expdate = new Date(expiretimes);
        let sql = new KnSQL("update tusertoken set authtoken = ?newtoken ");
        sql.append(", expiredate = ?expiredate, expiretime = ?expiretime, expiretimes = ?expiretimes ");
        sql.append("where useruuid = ?useruuid ");
        sql.append("and state = ?state and nonce = ?nonce ");
        sql.set("expiredate",expdate,"DATE");
        sql.set("expiretime",expdate,"TIME");
        sql.set("expiretimes",expiretimes);
        sql.set("newtoken",newtoken);
        sql.set("useruuid",authdata.identifier);
        sql.set("state",state);
        sql.set("nonce",nonce);
        this.logger.info(this.constructor.name+".changeUserToken",sql);
        return sql.executeUpdate(db,context);
    }

    public async processAccountToken(db: KnDBConnector, token: AuthenTokenData, context?: any) : Promise<Map<string,Object>> {
        let body : Map<string,Object> = new Map();
        let now = new Date();
        let sql = new KnSQL("select tuser.userid,tuser.username,tuser.userpassword,tuser.passwordexpiredate,tuser.site,");
        sql.append("tuser.accessdate,tuser.accesstime,tuser.changeflag,tuser.newflag,tuser.loginfailtimes,tuser.failtime,tuser.lockflag,tuser.firstpage,");
        sql.append("tuserinfo.userename,tuserinfo.useresurname,tuserinfo.email,tuserinfo.displayname,tuserinfo.langcode,tuserinfo.activeflag,tuserinfo.usercontents,");
        sql.append("tusertoken.expiretimes,tusertoken.code,tusertoken.state,tusertoken.nonce,tusertoken.authtoken,tusertoken.accesscontents,");
        sql.append("tusertoken.prime,tusertoken.generator,tusertoken.publickey,tusertoken.useruuid,tusertoken.factorcode ");
        sql.append("from tuser ");
        sql.append("left join tuserinfo on tuserinfo.userid = tuser.userid ");
        sql.append("left join tusertoken on tusertoken.useruuid = ?useruuid ");
        sql.append("and tusertoken.expiretimes >= ?expiretimes ");
        sql.append("and tusertoken.outdate is null and tusertoken.outtime is null ");
        sql.append("and tusertoken.userid = tuser.userid ");
        sql.append("where tuser.userid = ?userid "); 
        sql.set("expiretimes",now.getTime());
        sql.set("useruuid",token.identifier);
        sql.set("userid",token.accessor);
        let rs = await sql.executeQuery(db,context);
        this.logger.debug(this.constructor.name+".processAccountToken: effected "+rs.rows.length+" rows.");
        if(rs.rows && rs.rows.length>0) {
            let row = rs.rows[0];
            let handler = new TknTwoFactorHandler();
            let factorInfo = await handler.getFactorInfo(db, row.userid, true);                
            let token = new KnUserToken(row.useruuid,row.expiretimes,row.code,row.state,row.nonce,row.authtoken);
            let dh = { prime: row.prime, generator: row.generator, publickey: row.publickey };
            let ainfo = {userid: row.userid, email: row.email };
            this.composeResponseBody(body,token,row.username,{...row, ...factorInfo, ...ainfo},false,dh);
        } else {
            return Promise.reject(new VerifyError("Invalid access token",HTTP.NOT_ACCEPTABLE,-3023));
        }
        return Promise.resolve(body);
    }

    protected async doAccountToken(context: KnContextInfo, model: KnModel = this.model) : Promise<Map<string,Object>> {
        let token = this.getTokenKey(context);
        this.logger.debug(this.constructor.name+".doAccountToken: token = "+token);
        if(!token || token=="") {
            return Promise.reject(new VerifyError("Invalid access token",HTTP.NOT_ACCEPTABLE,-3021));	
        }
        let authtoken = await this.verifyAuthenToken(token);
        if(!authtoken) {
            return Promise.reject(new VerifyError("Invalid access token",HTTP.NOT_ACCEPTABLE,-3022));	
        }
        let db = this.getPrivateConnector(model);
        try {
            let body = await this.processAccountToken(db, authtoken, context);
            this.updateUserAccessing(context, { userid: body.get("userid") as string }, model);
            return body;
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

}
