import { KnModel } from "@willsofts/will-db";
import { AuthenError } from '@willsofts/will-lib';
import { HTTP, JSONReply } from "@willsofts/will-api";
import { KnSQL, KnDBConnector } from '@willsofts/will-sql';
import { Utilities } from "@willsofts/will-util";
import { ActiveUser, ActiveLibrary, ActiveConfig } from '@willsofts/will-lib';
import { KnContextInfo, KnSigninInfo } from '../models/KnCoreAlias';
import { KnResponser } from '../utils/KnResponser';
import { TknSigninHandler } from './TknSigninHandler';

export class TknSigninActiveDirectoryHandler extends TknSigninHandler {
    
    public override async performSignin(context: KnContextInfo, model: KnModel, signinfo: KnSigninInfo, db : KnDBConnector) : Promise<JSONReply> {
        let loginfo = undefined;
        let errmsg = undefined;
        let response = await this.processSigninActiveDirectory(context, model, signinfo, db, loginfo);
        if(response.head.errorflag=="N") {
            return Promise.resolve(response);
        } else {
            errmsg = response.head.errordesc;
        }
        return Promise.reject(new AuthenError(errmsg?errmsg as string:"Authentication fail",HTTP.UNAUTHORIZED));
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
                let factorInfo = await this.tokener.processTwoFactor(context, db, row);
                await db.beginWork();
                try {
                    await alib.saveUserInfo(db, au);
                    let usrinfo = {userid: au.accountName, site: row.site, code: pcode, state: pstate, nonce: pnonce, loginfo: loginfo};
                    let token  = await this.tokener.createUserAccess(db, usrinfo, context);
                    let dhinfo = await this.tokener.createDiffie(context, db, token);
                    let ainfo = {userid: row.userid, email: row.email };
                    this.tokener.composeResponseBody(body, token, pname, {...row, ...factorInfo, ...ainfo, accesscontents: loginfo}, false, dhinfo);
                    await db.commitWork();    
                    this.tokener.updateUserAccessing(context, model, { userid: au.accountName });
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

}
