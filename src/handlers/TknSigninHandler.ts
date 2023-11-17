import { KnModel } from "@willsofts/will-db";
import { AuthenTokenData, AuthenError, BasicLibrary, PasswordTemporary } from '@willsofts/will-lib';
import { HTTP, JSONReply } from "@willsofts/will-api";
import { KnSQL, KnDBConnector } from '@willsofts/will-sql';
import { PasswordLibrary } from '@willsofts/will-lib';
import { MAX_FAILURE, MAX_WAITTIME } from "../utils/EnvironmentVariable";
import { VerifyError } from '../models/VerifyError';
import { KnContextInfo, KnSigninInfo } from '../models/KnCoreAlias';
import { KnResponser } from '../utils/KnResponser';
import { TknSchemeHandler } from './TknSchemeHandler';
import { TknSigninTokenHandler } from "./TknSigninTokenHandler";
const bcrypt = require('bcrypt');

export class TknSigninHandler extends TknSchemeHandler {
    public model : KnModel = { name: "tuser", alias: { privateAlias: this.section } };

    //declared addon actions name
    public handlers = [ {name: "signin"}, {name: "signout"}, {name: "account"}, {name: "accesstoken"}, {name: "fetchtoken"}, {name: "validatetoken"}, {name: "access"} ];
    public tokener = new TknSigninTokenHandler();

    protected getSigninInfo(context: KnContextInfo) : KnSigninInfo {
        return { username: context.params.username, password: context.params.password, site: context.params.site };
    }

    public async signin(context: KnContextInfo) : Promise<JSONReply> {
        return this.callFunctional(context, {operate: "signin", raw: false}, this.doSignin);
	}

    public async signout(context: KnContextInfo) : Promise<Map<string,Object>> {
        return this.callFunctional(context, {operate: "signout", raw: false}, this.doSignout);
	}

    public async account(context: KnContextInfo) : Promise<Map<string,Object>> {
        return this.tokener.account(context);
	}

    public async accesstoken(context: KnContextInfo) : Promise<Map<string,Object>> {
        return this.tokener.accesstoken(context);
	}

    public async fetchtoken(context: KnContextInfo) : Promise<Map<string,Object>> {
        return this.tokener.fetchtoken(context);
	}

    public async validatetoken(context: KnContextInfo) : Promise<AuthenTokenData | undefined> {        
        return this.tokener.validatetoken(context);
	}

    public async access(context: KnContextInfo) : Promise<JSONReply> {
        return this.callFunctional(context, {operate: "access", raw: false}, this.doAccess);
	}

    protected async getBasicSigninInfo(context: KnContextInfo, db: KnDBConnector) : Promise<KnSigninInfo> {
        let signinfo = this.getSigninInfo(context);
        this.logger.debug(this.constructor.name+".getBasicSigninInfo : username="+signinfo.username);
        let authinfo = this.getAuthorizationInfo(context);
        this.logger.debug(this.constructor.name+".getBasicSigninInfo: auth info",authinfo);
        if(authinfo && authinfo.authorization.trim().length>0) {
            //if authen by basic, then decrypt
            let blib = new BasicLibrary();
            let basicinfo = await blib.decrypt(authinfo.authorization, authinfo.client, db);
            if(basicinfo) {
                this.logger.debug(this.constructor.name+".getBasicSigninInfo: basic info: username="+basicinfo.username);
                signinfo = {...signinfo, ...basicinfo};
            }
            this.logger.debug(this.constructor.name+".getBasicSigninInfo: sign info: username="+signinfo.username);
        }
        return signinfo;
    }

    protected async doSignin(context: KnContextInfo, model: KnModel) : Promise<JSONReply> {
        let db = this.getPrivateConnector(model);
        try {
            let signinfo = await this.getBasicSigninInfo(context, db);    
            if((!signinfo.username || signinfo.username.trim().length==0) || (!signinfo.password || signinfo.password.trim().length==0)) {
                return Promise.reject(new VerifyError("Invalid user or password",HTTP.BAD_REQUEST,-16081));
            }
            return await this.performSignin(context, db, signinfo, model);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            if(ex instanceof AuthenError) {
                return Promise.reject(ex);
            }
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

    protected async doAccess(context: KnContextInfo, model: KnModel) : Promise<JSONReply> {
        let db = this.getPrivateConnector(model);
        try {
            let signinfo = await this.getBasicSigninInfo(context, db);    
            if((!signinfo.username || signinfo.username.trim().length==0)) {
                return Promise.reject(new VerifyError("Invalid user name",HTTP.BAD_REQUEST,-16082));
            }
            return await this.performSigninAccess(context, db, signinfo, model);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            if(ex instanceof AuthenError) {
                return Promise.reject(ex);
            }
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

    public async performSignin(context: KnContextInfo, db : KnDBConnector, signinfo: KnSigninInfo, model: KnModel = this.model) : Promise<JSONReply> {
        let loginfo = undefined;
        let errmsg = undefined;
        let response = await this.processSigninInternalSystem(context, db, signinfo, model, loginfo);
        if(response.head.errorflag=="N") {
            return Promise.resolve(response);
        } else {
            errmsg = response.head.errordesc;
        }
        let errno = 0;
        if(response.head.errorcode!="") errno = parseInt(response.head.errorcode);
        return Promise.reject(new AuthenError(errmsg?errmsg as string:"Authentication fail",HTTP.UNAUTHORIZED,errno));
    }

    public async performSigninAccess(context: KnContextInfo, db : KnDBConnector, signinfo: KnSigninInfo, model: KnModel = this.model) : Promise<JSONReply> {
        let loginfo = undefined;
        let errmsg = undefined;
        let response = await this.processSigninAccessSystem(context, db, signinfo, model, loginfo);
        if(response.head.errorflag=="N") {
            return Promise.resolve(response);
        } else {
            errmsg = response.head.errordesc;
        }
        let errno = 0;
        if(response.head.errorcode!="") errno = parseInt(response.head.errorcode);
        return Promise.reject(new AuthenError(errmsg?errmsg as string:"Authentication fail",HTTP.UNAUTHORIZED,errno));
    }

    public async processSigninInternalSystem(context: KnContextInfo, db: KnDBConnector, signinfo: KnSigninInfo, model: KnModel = this.model, loginfo?: Object) : Promise<JSONReply> {
        let pname = signinfo.username;
        let ppass = signinfo.password;
        let pcode = context.params.code;
        let pstate = context.params.state;
        let pnonce = context.params.nonce;
        let response: JSONReply = new JSONReply();
        response.head.modeling("signin","signin");
        response.head.composeNoError();
        let body : Map<string,Object> = new Map(); 
        let sql = new KnSQL("select tuser.userid,tuser.username,tuser.userpassword,tuser.passwordexpiredate,tuser.site,");
        sql.append("tuser.accessdate,tuser.accesstime,tuser.changeflag,tuser.newflag,tuser.loginfailtimes,tuser.failtime,tuser.lockflag,");
        sql.append("tuserinfo.userename,tuserinfo.useresurname,tuserinfo.email,tuserinfo.displayname,tuserinfo.activeflag,tuserinfo.langcode,tuserinfo.usercontents ");
        sql.append("from tuser,tuserinfo ");
        sql.append("where tuser.username = ?username ");
        sql.append("and tuser.userid = tuserinfo.userid ");
        sql.set("username",pname);
        this.logger.info(this.constructor.name+".processSigninInternalSystem",sql);
        let rs = await sql.executeQuery(db,context);
        let rows = rs.rows;
        this.logger.debug(this.constructor.name+".processSigninInternalSystem: effected "+rows.length+" rows.");
        let passed = true;
        if(rows && rows.length>0) {
            let row = rows[0];
            let userid = row.userid;
            console.log("processSigninInternalSystem: row=",row);
            console.log("processSigninInternalSystem: userid="+userid);
            let site = row.site;
            this.logger.debug(this.constructor.name+".processSigninInternalSystem: MAX_FAILURE="+MAX_FAILURE+", loginfailtimes="+row.loginfailtimes);
            let failtimes = row.loginfailtimes;
            if(failtimes >= MAX_FAILURE) {
                let now = new Date();
                let failtime = row.failtime;
                let difftime = now.getTime() - failtime;
                this.logger.debug(this.constructor.name+".processSigninInternalSystem: MAX_WAITTIME="+MAX_WAITTIME+", failtime="+failtime+", difftime="+difftime);
                if(difftime <= MAX_WAITTIME) {
                    passed = false;
                    response.head.composeError("-5012","Signin failure over "+MAX_FAILURE+" times. Please contact administrator or wait and retry again after 3 minute");
                }
            }
            if(passed) {
                let tmppwd : PasswordTemporary | undefined = undefined;
                let ismatch = false;
                let tempmatch = false;
                let usrpass = row.userpassword;
                let plib : PasswordLibrary = new PasswordLibrary();
                ismatch = bcrypt.compareSync(ppass, usrpass);
                if(!ismatch) {
                    tmppwd = await plib.getUserTemporaryPassword(db, userid);
                    if(tmppwd && tmppwd.trxid) {
                        tempmatch = bcrypt.compareSync(ppass, tmppwd.userpassword);
                        ismatch = tempmatch;
                    }
                }                
                this.logger.debug(this.constructor.name+".processSigninInternalSystem: temporary match="+tempmatch+", is match="+ismatch);
                if(!ismatch) {
                    passed = false;
                    response.head.composeError("-3002","Invalid user or password");
                } else {
                    try {
                        let factorInfo = await this.tokener.processTwoFactor(context, db, row);
                        await db.beginWork();
                        try {
                            if(tempmatch) {
                                await plib.updatePasswordFromTemporary(db, tmppwd?.trxid, userid);
                            }
                            let usrinfo = {userid: userid, site: site, code: pcode, state: pstate, nonce: pnonce, loginfo: loginfo};
                            let token  = await this.tokener.createUserAccess(db, usrinfo, context);
                            let dhinfo = await this.tokener.createDiffie(context, db, token);
                            let ainfo = {userid: row.userid, email: row.email };
                            this.tokener.composeResponseBody(body, token, pname, {...row, ...factorInfo, ...ainfo, accesscontents: loginfo}, tempmatch, dhinfo);
                            await db.commitWork();    
                        } catch(er: any) {
                            this.logger.error(this.constructor.name,er);
                            await db.rollbackWork();
                            this.logger.debug(this.constructor.name+".processSigninInternalSystem: roll back work"); 
                            response = KnResponser.createDbError("ensure","signin",er);
                        }
                    } catch(ex: any) {
                        this.logger.error(this.constructor.name,ex);
                        response = KnResponser.createDbError("ensure","signin",ex);
                    }
                }
            }
        } else {
            passed = false;
            response.head.composeError("-3003","Invalid user or password");
        }
        try {
            if(passed) {
                this.tokener.updateUserAccessing(context, { userid: body.get("userid") as string, username: pname, lockflag: "0"});
            } else {
                this.tokener.updateUserAccessing(context, { username: pname, lockflag: "1"});
            }    
        } catch(ex) {
            this.logger.error(this.constructor.name,ex);
        }
        response.body = Object.fromEntries(body);
        return Promise.resolve(response);
    }

    public async doSignout(context: KnContextInfo, model: KnModel = this.model) : Promise<Map<string,Object>> {
        let puuid = context.params.useruuid;
        this.logger.debug(this.constructor.name+".doSignout: useruuid = "+puuid);
        if(!puuid || puuid=="") {            
            let token = await this.getAuthenToken(context, false, false);
            if(token) {
                puuid = token.identifier;
            }
        }
        if(!puuid || puuid=="") {
            return Promise.reject(new VerifyError("Invalid access token",HTTP.NOT_ACCEPTABLE,-3010));
        }
        try {
            let session : any = context.meta?.session;
            if(session) {
                delete session.dh;
                delete session.user;
            }
            delete context.meta.user;
        } catch(ex) { }
        let db = this.getPrivateConnector(model);
        try {
            return await this.processSignout(db, puuid, context);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

    public async processSignout(db: KnDBConnector, useruuid: string, context?: any) : Promise<Map<string,Object>> {
        let body : Map<string,string> = new Map();
        let rs = await this.tokener.deleteTokenByUser(db, useruuid, context);
        this.logger.debug(this.constructor.name+".processSignout: affected "+rs.rows.affectedRows+" rows.");
        if(rs.rows.affectedRows>0) {
            body.set("affected",rs.rows.affectedRows);
        } else {
            return Promise.reject(new VerifyError("Invalid access token",HTTP.BAD_REQUEST,-3011));
        }
        return Promise.resolve(body);
    }

    public async processSigninAccessSystem(context: KnContextInfo, db: KnDBConnector, signinfo: KnSigninInfo, model: KnModel = this.model, loginfo?: Object) : Promise<JSONReply> {
        let pname = signinfo.username;
        let pcode = context.params.code;
        let pstate = context.params.state;
        let pnonce = context.params.nonce;
        let response: JSONReply = new JSONReply();
        response.head.modeling("signin","signin");
        response.head.composeNoError();
        let body : Map<string,Object> = new Map(); 
        let sql = new KnSQL("select tuser.userid,tuser.username,tuser.userpassword,tuser.passwordexpiredate,tuser.site,");
        sql.append("tuser.accessdate,tuser.accesstime,tuser.changeflag,tuser.newflag,tuser.loginfailtimes,tuser.failtime,tuser.lockflag,");
        sql.append("tuserinfo.userename,tuserinfo.useresurname,tuserinfo.email,tuserinfo.displayname,tuserinfo.activeflag,tuserinfo.langcode,tuserinfo.usercontents ");
        sql.append("from tuser,tuserinfo ");
        sql.append("where tuser.username = ?username ");
        sql.append("and tuser.userid = tuserinfo.userid ");
        sql.set("username",pname);
        this.logger.info(this.constructor.name+".processSigninAccessSystem",sql);
        let rs = await sql.executeQuery(db,context);
        let rows = rs.rows;
        this.logger.debug(this.constructor.name+".processSigninAccessSystem: effected "+rows.length+" rows.");
        let passed = true;
        if(rows && rows.length>0) {
            let row = rows[0];
            let userid = row.userid;
            console.log("processSigninAccessSystem: row=",row);
            console.log("processSigninAccessSystem: userid="+userid);
            let site = row.site;
            if(passed) {
                let tempmatch = false;
                try {
                    let factorInfo = await this.tokener.processTwoFactor(context, db, row);
                    await db.beginWork();
                    try {
                        let usrinfo = {userid: userid, site: site, code: pcode, state: pstate, nonce: pnonce, loginfo: loginfo};
                        let token  = await this.tokener.createUserAccess(db, usrinfo, context);
                        let dhinfo = await this.tokener.createDiffie(context, db, token);
                        let ainfo = {userid: row.userid, email: row.email };
                        this.tokener.composeResponseBody(body, token, pname, {...row, ...factorInfo, ...ainfo, accesscontents: loginfo}, tempmatch, dhinfo);
                        await db.commitWork();    
                    } catch(er: any) {
                        this.logger.error(this.constructor.name,er);
                        await db.rollbackWork();
                        this.logger.debug(this.constructor.name+".processSigninAccessSystem: roll back work"); 
                        response = KnResponser.createDbError("ensure","signin",er);
                    }
                } catch(ex: any) {
                    this.logger.error(this.constructor.name,ex);
                    response = KnResponser.createDbError("ensure","signin",ex);
                }
            }
        } else {
            passed = false;
            response.head.composeError("-4004","Account not found");
        }
        try {
            this.tokener.updateUserAccessing(context, { userid: body.get("userid") as string, lockflag: "0"});
        } catch(ex) {
            this.logger.error(this.constructor.name,ex);
        }
        response.body = Object.fromEntries(body);
        return Promise.resolve(response);
    }

}
