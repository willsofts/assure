import { v4 as uuid } from 'uuid';
import { HTTP } from "@willsofts/will-api";
import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnResultSet, KnSQL } from '@willsofts/will-sql';
import { Utilities } from "@willsofts/will-util";
import { MailLibrary, MailInfo, PasswordLibrary } from "@willsofts/will-lib";
import { KnContextInfo, KnDataTable, KnActivateInfo, KnTemplateInfo } from "../models/KnCoreAlias";
import { VerifyError } from "../models/VerifyError";
import { KnNotifyConfig } from "../utils/KnNotifyConfig";
import { KnUtility } from "../utils/KnUtility";
import { TknActivateHandler } from "./TknActivateHandler";
import { TknProcessHandler } from './TknProcessHandler';
import { DEFAULT_ACCOUNT_INVALIDATE_TIMES } from "../utils/EnvironmentVariable";

export class TknAccountHandler extends TknProcessHandler {

    public progid = "account";
    public model : KnModel = { 
        name: "tactivate", 
        alias: { privateAlias: this.section }, 
    };

    public createActivateKey() : string {
        return uuid();
    }

    public createActivateInfo(data?: any, invalidatetimes: number = DEFAULT_ACCOUNT_INVALIDATE_TIMES) : KnActivateInfo {
        let keyid = this.createActivateKey();
        let transtime = data?.transtime || Utilities.now().getTime();
        return {
            activatekey: data?.activatekey || keyid,
            activateuser: data?.activateuser || keyid,
            transtime: transtime,
            expiretime: transtime + invalidatetimes,
            activatecount: data?.activatecount || 0,
            activatetimes: data?.activatetimes || 3,
            expiredate: data?.expiredate,
            activatecategory: data?.activatecategory || "ACCOUNT",
            activatestatus: data?.activatestatus,
            activatelink: data?.activatelink,
            activatepage: data?.activatepage || "account",
            activateremark: data?.activateremark,
            activateparameter: data?.activateparameter,
            activatemessage: data?.activatemessage,
            activatecontents: data?.activatecontents
        };
    }

    public async createActivation(db: KnDBConnector, info: KnActivateInfo): Promise<KnResultSet> {
        let handler = new TknActivateHandler();
        return await handler.createActivation(db, info);
    }

    public override async doCreate(context: KnContextInfo, model: KnModel) : Promise<KnActivateInfo> {
        let handler = new TknActivateHandler();
        return await handler.doCreate(context, model, DEFAULT_ACCOUNT_INVALIDATE_TIMES);
    }

    public async doInactivate(context: KnContextInfo, model: KnModel) : Promise<KnActivateInfo> {
        let handler = new TknActivateHandler();
        let vi = handler.validateKeyFields(context);
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        let db = this.getPrivateConnector(model);
        try {
            return await this.doInactivating(context, model, db);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    public async doInactivating(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnActivateInfo> {
        let eng = KnUtility.isEnglish(context);
        let handler = new TknActivateHandler();
        let ainfo = await handler.doInactivating(context, db);
        if(ainfo) {
            let rs = await this.getAccountInfo(db, ainfo.activateuser, ainfo.activateremark, context);
            if(rs && rs.rows.length>0) {
                let row = rs.rows[0];
                let pwd = PasswordLibrary.createNewPassword();
                let plib = new PasswordLibrary();
                await plib.updatePassword(db,row.site,row.userid,pwd,Utilities.now(),false,"1","A");
                row.userfullname = row.usertname+" "+row.usertsurname;
                row.userpassword = pwd;
                let [msg,tmp] = await this.composeMailNotify(db, row, eng);
                this.doSendMail(context, model, {email: row.email, subject: tmp?tmp.subjecttitle:"Confirm New Account", message: msg});
            } else {
                return Promise.reject(new VerifyError("Account not found",HTTP.NOT_FOUND,-16104));
            }            
        }
        return ainfo;
    }

    public async getAccountInfo(db: KnDBConnector, username: string, email?: string, context?: any) : Promise<KnResultSet> {
        if(!username || username.trim().length==0) {
            return this.createRecordSet();
        }
        let sql = new KnSQL();
        sql.append("select tuser.userid,tuser.site,tuser.username,");
        sql.append("tuserinfo.email,tuserinfo.usertname,tuserinfo.usertsurname ");
        sql.append("from tuser,tuserinfo ");
        sql.append("where tuser.userid = tuserinfo.userid ");
        sql.append("and tuser.username = ?username ");
        if(email && email.trim().length>0) {
            sql.append("and tuserinfo.email = ?email ");
        }
        sql.set("username", username);
        sql.set("email", email);
        return await sql.executeQuery(db,context);
    }

    public async composeMailNotify(db: KnDBConnector, record: any, eng: boolean = true, template: string = "USER_ACTIVATE", templatetype: string = "MAIL_NOTIFY") : Promise<[string,KnTemplateInfo|undefined]> {
        let msg = undefined;
        let noti = new KnNotifyConfig();
        let tmp = await noti.getConfigTemplate(db, template, templatetype);
        if(tmp) {
            msg = eng?tmp.contents:tmp.contexts;
        }
        if(!msg || msg.trim().length==0) {
            msg = "Dear, ${userfullname}.<br/>";
            msg += "Confirm your account was activated<br/>";
            msg += "Please kindly use information below to access the system<br/><br/>";
            msg += "user = ${username}<br/>";
            msg += "password = ${userpassword}<br/>";
            msg += "<br/>Yours sincerely,<br/>";
            msg += "Administrator<br/>";
        }
        return [Utilities.translateVariables(msg, record),tmp];	
    }

	protected async doSendMail(context: KnContextInfo, model: KnModel, info: MailInfo) : Promise<void> {
		let db = this.getPrivateConnector(model);
		try {
			await MailLibrary.sendMail(info, db);	
		} catch(ex: any) {
			this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
		}
	}

    /* override to handle launch router when invoked from menu */
    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        try {
            let ainfo = await this.doInactivate(context, model);
            return {action: KnOperation.EXECUTE, entity: {}, dataset: ainfo, renderer: "account/account_success"};
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return {action: KnOperation.EXECUTE, entity: {}, dataset: {}, renderer: "account/account_error", error: ex};
        }
    }

}
