import { KnModel } from "@willsofts/will-db";
import { AuthenError } from '@willsofts/will-lib';
import { HTTP, JSONReply } from "@willsofts/will-api";
import { KnSQL, KnDBConnector } from '@willsofts/will-sql';
import { Utilities } from "@willsofts/will-util";
import { AuthenLibrary, PromptConfig, PromptUser } from '@willsofts/will-lib';
import { NEWS_URL_ALWAYS_OPEN } from "../utils/EnvironmentVariable";
import { KnContextInfo, KnSigninInfo } from '../models/KnCoreAlias';
import { KnResponser } from '../utils/KnResponser';
import { TknSigninHandler } from './TknSigninHandler';

export class TknSigninPromptHandler extends TknSigninHandler {

    public override async performSignin(context: KnContextInfo, db : KnDBConnector, signinfo: KnSigninInfo, model: KnModel = this.model) : Promise<JSONReply> {
        let errmsg = undefined;
        let response = await this.performSigninPrompt(context, db, signinfo, model);
        if(response.head.errorflag=="N") {
            return Promise.resolve(response);
        } else {
            errmsg = response.head.errordesc;
        }
        return Promise.reject(new AuthenError(errmsg?errmsg as string:"Authentication fail",HTTP.UNAUTHORIZED));
    }

    public async performSigninPrompt(context: KnContextInfo, db : KnDBConnector, signinfo: KnSigninInfo, model: KnModel = this.model) : Promise<JSONReply> {
        try {
            let loginfo = await this.loginWow(signinfo.username, signinfo.password);        
            return await this.processSigninPromptSystem(context, db, signinfo, model , loginfo);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(ex);
        }
    }

    public async processSigninPromptSystem(context: KnContextInfo, db: KnDBConnector, signinfo: KnSigninInfo, model: KnModel = this.model, config?: PromptConfig, loginfo?: Object) : Promise<JSONReply> {
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
                let factorInfo = await this.getTokener().processTwoFactor(context, db, row);
                await db.beginWork();
                try {
                    await alib.saveUserInfo(db, pu);
                    let usrinfo = {userid: pu.userid as string, site: row.site, code: pcode, state: pstate, nonce: pnonce, loginfo: pu};
                    let token  = await this.getTokener().createUserAccess(db, usrinfo, context);
                    let dhinfo = await this.getTokener().createDiffie(context, db, token);
                    let ainfo = {userid: row.userid, email: row.email };
                    this.getTokener().composeResponseBody(body, token, pname, {...row, ...factorInfo, ...ainfo, accesscontents: pu}, false, dhinfo);
                    await db.commitWork();    
                    this.getTokener().updateUserAccessing(context, { userid: pu.userid as string });
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

}
