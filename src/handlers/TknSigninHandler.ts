import { v4 as uuid } from 'uuid';
import { KnModel } from "@willsofts/will-db";
import { AuthenError, BasicLibrary, AuthenTokenData, PasswordTemporary } from '@willsofts/will-lib';
import { HTTP, JSONReply } from "@willsofts/will-api";
import { KnSQL, KnDBConnector } from '@willsofts/will-sql';
import { Configure, Utilities } from "@willsofts/will-util";
import { AuthenToken, ActiveAuthen, ActiveUser, PasswordLibrary, ActiveLibrary, ActiveConfig, AuthenLibrary, PromptConfig, PromptUser } from '@willsofts/will-lib';
import { EXPIRE_TIMES, MAX_FAILURE, MAX_WAITTIME, NEWS_URL_ALWAYS_OPEN, AUTHEN_BY_VERIFY_DOMAIN } from "../utils/EnvironmentVariable";
import { KnUserToken } from "../models/KnUserToken";
import { VerifyError } from '../models/VerifyError';
import { KnContextInfo, KnDiffieInfo, KnSigninInfo, KnUserAccessInfo, KnAccessingInfo, KnFactorInfo } from '../models/KnCoreAlias';
import { KnResponser } from '../utils/KnResponser';
import { TknDiffieHandler } from './TknDiffieHandler';
import { TknSchemeHandler } from './TknSchemeHandler';
import { TknTwoFactorHandler } from './TknTwoFactorHandler';
const bcrypt = require('bcrypt');

export class TknSigninHandler extends TknSchemeHandler {
    public model : KnModel = { name: "tuser", alias: { privateAlias: this.section } };

    //declared addon actions name
    public handlers = [ {name: "signin"}, {name: "accesstoken"}, {name: "fetchtoken"}, {name: "validatetoken"}, {name: "signout"}, {name: "account"} ];

    protected getSigninInfo(context: KnContextInfo) : KnSigninInfo {
        return { username: context.params.username, password: context.params.password, site: context.params.site };
    }

    public async signin(context: KnContextInfo) : Promise<JSONReply> {
        return this.callFunctional(context, {operate: "signin", raw: false}, this.doSignin);
	}

    protected async doSignin(context: KnContextInfo, model: KnModel) : Promise<JSONReply> {
        let signinfo = this.getSigninInfo(context);
        this.logger.debug(this.constructor.name+".doSignin : username="+signinfo.username);
        let db = this.getPrivateConnector(model);
        try {    
            let authinfo = this.getAuthorizationInfo(context);
            this.logger.debug(this.constructor.name+".doSignin: auth info",authinfo);
            if(authinfo && authinfo.authorization.trim().length>0) {
                //if authen by basic, then decrypt
                let blib = new BasicLibrary();
                let basicinfo = await blib.decrypt(authinfo.authorization, authinfo.client, db);
                if(basicinfo) {
                    this.logger.debug(this.constructor.name+".doSignin: basic info: username="+basicinfo.username);
                    signinfo = {...signinfo, ...basicinfo};
                }
                this.logger.debug(this.constructor.name+".doSignin: sign info: username="+signinfo.username);
            }
            if((!signinfo.username || signinfo.username.trim().length==0) || (!signinfo.password || signinfo.password.trim().length==0)) {
                return Promise.reject(new VerifyError("Invalid user or password",HTTP.BAD_REQUEST,-16081));
            }
            if(AUTHEN_BY_VERIFY_DOMAIN) {
                return await this.doSigninByDomain(context, model, signinfo, db);
            } else {
                return await this.doSigninByConfigure(context, model, signinfo, db);
            }
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

    public async doSigninByDomain(context: KnContextInfo, model: KnModel, signinfo: KnSigninInfo, db : KnDBConnector) : Promise<JSONReply> {
        try {
            let loginfo = await this.loginWow(signinfo.username, signinfo.password);        
            let account = ActiveAuthen.getAccountDomain(signinfo.username);
            let adconfig = await ActiveLibrary.getActiveConfig(db, account.domainName);
            this.logger.debug(this.constructor.name+".doSigninByDomain: ad config = "+(adconfig?adconfig.hasConfigure():false));
            if(adconfig && adconfig.hasConfigure()) {
                return await this.processSigninActiveDirectory(context, model, signinfo, db , adconfig, loginfo);
            } else {
                return await this.processSigninInternalSystem(context, model, signinfo, db , loginfo);
            }
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(ex);
        }
    }

    public async doSigninByConfigure(context: KnContextInfo, model: KnModel, signinfo: KnSigninInfo, db : KnDBConnector) : Promise<JSONReply> {
        let loginfo = undefined;
        let errmsg = undefined;
        let authlist = Configure.getConfig("authentications");
        if(authlist && authlist.length>0) {
            for(let i=0,isz=authlist.length;i<isz;i++) {
                let aut = authlist[i];
                if(aut.enabled) {
                    if("SYSTEM"==aut.authtype) {
                        let response = await this.processSigninInternalSystem(context, model, signinfo, db, loginfo);
                        if(response.head.errorflag=="N") {
                            return Promise.resolve(response);
                        } else {
                            errmsg = response.head.errordesc;
                        }
                    } else if("AD"==aut.authtype) {
                        let adconfig = ActiveLibrary.createConfigure(aut);
                        this.logger.debug(this.constructor.name+".doSigninByConfigure: ad config = "+(adconfig?adconfig.hasConfigure():false));
                        if(adconfig && adconfig.hasConfigure()) {
                            let response = await this.processSigninActiveDirectory(context, model, signinfo, db, adconfig, loginfo);
                            if(response.head.errorflag=="N") {
                                return Promise.resolve(response);
                            } else {
                                errmsg = response.head.errordesc;
                            }
                        }
                    } else {
                        let response = await this.processSigninPromptSystem(context, model, signinfo, db, loginfo);
                        if(response.head.errorflag=="N") {
                            return Promise.resolve(response);
                        } else {
                            errmsg = response.head.errordesc;
                        }
                    }
                }
            }        
        }
        return Promise.reject(new AuthenError(errmsg?errmsg as string:"Authentication fail",HTTP.UNAUTHORIZED));
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

    public async processSigninInternalSystem(context: KnContextInfo, model: KnModel, signinfo: KnSigninInfo, db: KnDBConnector, loginfo?: Object) : Promise<JSONReply> {
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
                        let factorInfo = await this.processTwoFactor(context, db, row);
                        await db.beginWork();
                        try {
                            if(tempmatch) {
                                await plib.updatePasswordFromTemporary(db, tmppwd?.trxid, userid);
                            }
                            let usrinfo = {userid: userid, site: site, code: pcode, state: pstate, nonce: pnonce, loginfo: loginfo};
                            let token  = await this.createUserAccess(db, usrinfo, context);
                            let dhinfo = await this.createDiffie(context, db, token);
                            let ainfo = {userid: row.userid, email: row.email };
                            this.composeResponseBody(body, token, pname, {...row, ...factorInfo, ...ainfo, accesscontents: loginfo}, tempmatch, dhinfo);
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
                this.updateUserAccessing(context, model, { userid: body.get("userid") as string, username: pname, lockflag: "0"});
            } else {
                this.updateUserAccessing(context, model, { username: pname, lockflag: "1"});
            }    
        } catch(ex) {
            this.logger.error(this.constructor.name,ex);
        }
        response.body = Object.fromEntries(body);
        return Promise.resolve(response);
    }

    public async processSigninActiveDirectory(context: KnContextInfo, model: KnModel, signinfo: KnSigninInfo, db: KnDBConnector, config?: ActiveConfig, loginfo?: Object) : Promise<JSONReply> {
        let pname = signinfo.username;
        let ppass = signinfo.password;
        let pcode = context.params.code;
        let pstate = context.params.state;
        let pnonce = context.params.nonce;
        let response: JSONReply = new JSONReply();
        response.head.modeling("signin","signin");
        response.head.composeNoError();
        let body : Map<string,Object> = new Map();
        let alib : ActiveLibrary = new ActiveLibrary();
        try {
            let au : ActiveUser = await alib.authenticate(pname, ppass, config, db);
            try {
                let row = { accessdate: new Date(), accesstime: Utilities.currentTime(), userid: au.accountName, userename: au.firstName, useresurname: au.lastName, email: au.principalName, displayname: au.displayName, activeflag: "1", usercontents: null, changeflag: "0", site: undefined };
                let sql = new KnSQL("select site,accessdate,accesstime,userid,userename,useresurname,email,displayname,activeflag,usercontents,'0' as changeflag,'0' as newflag ");
                sql.append("from tuserinfo where userid = ?userid ");
                sql.set("userid",au.accountName);
                let rs = await sql.executeQuery(db);
                if(rs.rows && rs.rows.length>0) {
                    row = rs.rows[0];
                }
                let factorInfo = await this.processTwoFactor(context, db, row);
                await db.beginWork();
                try {
                    await alib.saveUserInfo(db, au);
                    let usrinfo = {userid: au.accountName, site: row.site, code: pcode, state: pstate, nonce: pnonce, loginfo: loginfo};
                    let token  = await this.createUserAccess(db, usrinfo, context);
                    let dhinfo = await this.createDiffie(context, db, token);
                    let ainfo = {userid: row.userid, email: row.email };
                    this.composeResponseBody(body, token, pname, {...row, ...factorInfo, ...ainfo, accesscontents: loginfo}, false, dhinfo);
                    await db.commitWork();    
                    this.updateUserAccessing(context, model, { userid: au.accountName });
                } catch(er: any) {
                    this.logger.error(this.constructor.name,er);
                    await db.rollbackWork();
                    this.logger.debug(this.constructor.name+".processSigninActiveDirectory: roll back work"); 
                    response = KnResponser.createError("ensure","signin",er);
                }
            } catch(ex: any) {
                this.logger.error(this.constructor.name,ex);
                response = KnResponser.createError("ensure","signin",ex);
            }
            response.body = Object.fromEntries(body);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            response = KnResponser.createError("ensure", "signin", ex);
        }
        return Promise.resolve(response);
    }

    public async processSigninPromptSystem(context: KnContextInfo, model: KnModel, signinfo: KnSigninInfo, db: KnDBConnector, config?: PromptConfig, loginfo?: Object) : Promise<JSONReply> {
        let pname = signinfo.username;
        let ppass = signinfo.password;
        let pcode = context.params.code;
        let pstate = context.params.state;
        let pnonce = context.params.nonce;
        let response: JSONReply = new JSONReply();
        response.head.modeling("signin","signin");
        response.head.composeNoError();
        let body : Map<string,Object> = new Map();
        let alib : AuthenLibrary = new AuthenLibrary();
        try {
            let pu : PromptUser = await alib.authenticate(pname, ppass, config, db);
            try {
                let row = { accessdate: new Date(), accesstime: Utilities.currentTime(), userid: pu.userid, userename: pu.username, useresurname: pu.usersurname, email: pu.email, displayname: pu.displayname, activeflag: "1", usercontents: null, changeflag: "0", site: undefined };
                let sql = new KnSQL("select site,accessdate,accesstime,userid,userename,useresurname,email,displayname,activeflag,usercontents,'0' as changeflag,'0' as newflag ");
                sql.append("from tuserinfo where userid = ?userid ");
                sql.set("userid",pu.userid);
                this.logger.info(this.constructor.name+".processSigninPromptSystem",sql);
                let rs = await sql.executeQuery(db);
                if(rs.rows && rs.rows.length>0) {
                    row = rs.rows[0];
                }
                let factorInfo = await this.processTwoFactor(context, db, row);
                await db.beginWork();
                try {
                    await alib.saveUserInfo(db, pu);
                    let usrinfo = {userid: pu.userid as string, site: row.site, code: pcode, state: pstate, nonce: pnonce, loginfo: pu};
                    let token  = await this.createUserAccess(db, usrinfo, context);
                    let dhinfo = await this.createDiffie(context, db, token);
                    let ainfo = {userid: row.userid, email: row.email };
                    this.composeResponseBody(body, token, pname, {...row, ...factorInfo, ...ainfo, accesscontents: pu}, false, dhinfo);
                    await db.commitWork();    
                    this.updateUserAccessing(context, model, { userid: pu.userid as string });
                } catch(er: any) {
                    this.logger.error(this.constructor.name,er);
                    await db.rollbackWork();
                    this.logger.debug(this.constructor.name+".processSigninPromptSystem: roll back work"); 
                    response = KnResponser.createError("ensure","signin",er);
                }
            } catch(ex: any) {
                this.logger.error(this.constructor.name,ex);
                response = KnResponser.createError("ensure","signin",ex);
            }
            response.body = Object.fromEntries(body);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            response = KnResponser.createError("ensure", "signin", ex);
        }
        return Promise.resolve(response);
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
        let authdata = {identifier:useruuid, site:usrinfo.site, accessor:usrinfo.userid};
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

    public async createDiffie(context: KnContextInfo, db: KnDBConnector, token: KnUserToken) : Promise<KnDiffieInfo | undefined> {
        let handler : TknDiffieHandler = new TknDiffieHandler();
        let dh = await handler.createDiffie(context);
        console.log(this.constructor.name+".createDiffie",dh);
        await handler.saveDiffie(db, {useruuid: token.useruuid }, dh, context);
        let info = handler.createKnDiffieInfo(dh);
        return Promise.resolve(info);
    }

    public async updateUserAccessing(context: KnContextInfo, model: KnModel, info: KnAccessingInfo) : Promise<void> {
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

    public async accesstoken(context: KnContextInfo) : Promise<Map<string,Object>> {
        return this.callFunctional(context, {operate: "accesstoken", raw: false}, this.doAccessToken);
	}

    public async account(context: KnContextInfo) : Promise<Map<string,Object>> {
        return this.callFunctional(context, {operate: "account", raw: false}, this.doAccessToken);
	}

    protected async doAccessToken(context: KnContextInfo, model: KnModel) : Promise<Map<string,Object>> {
        let token = this.getTokenKey(context);
        this.logger.debug(this.constructor.name+".doAccessToken: token = "+token);
        if(!token || token=="") {
            return Promise.reject(new VerifyError("Invalid access token",HTTP.NOT_ACCEPTABLE,-3010));	
        }
        await this.verifyAuthenToken(token);
        let db = this.getPrivateConnector(model);
        try {
            let body = await this.processAccessToken(db, token, false, context);
            this.updateUserAccessing(context, model, { userid: body.get("userid") as string });
            return body;
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

    public async processAccessToken(db: KnDBConnector, useruuid: string, fetching: boolean = true, context?: any) : Promise<Map<string,Object>> {
        let body : Map<string,Object> = new Map();
        let now = new Date();
        let sql = new KnSQL("select tuser.userid,tuser.username,tuser.userpassword,tuser.passwordexpiredate,tuser.site,");
        sql.append("tuser.accessdate,tuser.accesstime,tuser.changeflag,tuser.newflag,tuser.loginfailtimes,tuser.failtime,tuser.lockflag,");
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

    public async fetchtoken(context: KnContextInfo) : Promise<Map<string,Object>> {
        return this.callFunctional(context, {operate: "fetchtoken", raw: false}, this.doFetchToken);
	}

    protected async doFetchToken(context: KnContextInfo, model: KnModel) : Promise<Map<string,Object>> {
        let puuid = context.params.useruuid;
        this.logger.debug(this.constructor.name+".doFetchToken: useruuid = "+puuid);
        if(!puuid || puuid=="") {
            return Promise.reject(new VerifyError("Invalid access user",HTTP.NOT_ACCEPTABLE,-3010));	
        }
        let db = this.getPrivateConnector(model);
        try {
            let body = await this.processAccessToken(db, puuid, true);
            this.updateUserAccessing(context, model, { userid: body.get("userid") as string });
            return body;
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

    public async signout(context: KnContextInfo) : Promise<Map<string,Object>> {
        return this.callFunctional(context, {operate: "signout", raw: false}, this.doSignout);
	}

    public async doSignout(context: KnContextInfo, model: KnModel) : Promise<Map<string,Object>> {
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
        let sql = new KnSQL("delete from tusertoken where useruuid = ?useruuid ");
        sql.set("useruuid",useruuid);
        this.logger.info(this.constructor.name+".processSignout",sql);
        let rs = await sql.executeUpdate(db,context);
        this.logger.debug(this.constructor.name+".processSignout: affected "+rs.rows.affectedRows+" rows.");
        if(rs.rows.affectedRows>0) {
            body.set("affected",rs.rows.affectedRows);
        } else {
            return Promise.reject(new VerifyError("Invalid access token",HTTP.BAD_REQUEST,-3011));
        }
        return Promise.resolve(body);
    }

    public async loginWow(userid: string, pwd: string, site?: string) : Promise<any> {
        let result : Object = {};
        if(NEWS_URL_ALWAYS_OPEN) result = AuthenLibrary.getDefaultResponse();
        try {
            let cfg = AuthenLibrary.getDefaultConfigure(site);
            this.logger.debug(this.constructor.name+".loginWow: login config",cfg);
            let alib : AuthenLibrary = new AuthenLibrary();
            let res = await alib.authenticate(userid, pwd, cfg);
            return Promise.resolve(res);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
        }
        return Promise.resolve(result);
    }

    public async validatetoken(context: KnContextInfo) : Promise<AuthenTokenData | undefined> {
        await this.exposeFunctional(context, this.model, {operate:"validatetoken"});
        return this.getAuthenToken(context, true, true);
	}

}
