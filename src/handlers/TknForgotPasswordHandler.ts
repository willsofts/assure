import { KnModel } from "@willsofts/will-db";
import { KnDBConnector, KnSQL } from '@willsofts/will-sql';
import { PasswordLibrary, PasswordVerify, CaptchaLibrary, MailInfo } from '@willsofts/will-lib';
import { HTTP } from "@willsofts/will-api";
import { Utilities } from "@willsofts/will-util";
import { VerifyError } from "../models/VerifyError";
import { KnContextInfo, KnUserInfo, KnTemplateInfo } from '../models/KnCoreAlias';
import { KnNotifyConfig } from '../utils/KnNotifyConfig';
import { TknSchemeHandler } from './TknSchemeHandler';

export class TknForgotPasswordHandler extends TknSchemeHandler {
    public model : KnModel = { name: "tuser", alias: { privateAlias: this.section } };

    //declared addon actions name
    public handlers = [ {name: "password"} ];

    public async password(context: KnContextInfo) : Promise<PasswordVerify> {
		return this.callFunctional(context, {operate: "password", raw: false}, this.doPassword);
    }

	protected async doPassword(context: KnContextInfo, model: KnModel) : Promise<PasswordVerify> {
		let pemail = context.params.email;	
		let psecurecode = context.params.securecode;
		let pcapid = context.params.capid;
		if(!pemail || pemail.trim().length==0) {
			return Promise.reject(new VerifyError("Email not defined",HTTP.NOT_ACCEPTABLE,-16050));
		}
		if((!pcapid || pcapid.trim().length==0) || (!psecurecode || psecurecode.trim().length==0)) {
			return Promise.reject(new VerifyError("Answer code not defined",HTTP.NOT_ACCEPTABLE,-16051));
		}
		let db = this.getPrivateConnector(model);
		try {
			let caplib : CaptchaLibrary = new CaptchaLibrary();
			let valid = await caplib.verifyCaptcha(db, pcapid, psecurecode);
			if(!valid) {
				return Promise.reject(new VerifyError("Secure code is invalid",HTTP.NOT_ACCEPTABLE,-16052));
			}
			let date = new Date();
			let KnUserInfo = await this.getUserInfoByEmail(db, pemail, context);
			if(KnUserInfo.found) {
				let verify = await this.performForgotPassword(context, model, db, KnUserInfo, date);
				if(!verify.result) {
					return Promise.reject(new VerifyError(verify.msg as string,HTTP.NOT_ALLOWED,verify.errno));
				}
				return verify;
			} else {
				return Promise.reject(new VerifyError("User not found",HTTP.NOT_ACCEPTABLE,-16053));
			}
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
		}
	}

	public async getUserInfoByEmail(db: KnDBConnector, email: string, context?: any) : Promise<KnUserInfo> {
		let userInfo : KnUserInfo = { found: false, userid: "", email: email };
		let sql = new KnSQL("select tuser.site,tuser.userid,tuser.username,tuserinfo.email,");
		sql.append("tuserinfo.userename,tuserinfo.useresurname,tuserinfo.usertname,tuserinfo.usertsurname ");
		sql.append("from tuser,tuserinfo ");
		sql.append("where tuser.userid = tuserinfo.userid ");
		sql.append("and tuserinfo.email = ?email ");
		sql.set("email",email);
		this.logger.info(this.constructor.name+".getUserInfoByEmail",sql);
		let rs = await sql.executeQuery(db,context);
		this.logger.debug(this.constructor.name+".getUserInfoByEmail","effected "+rs.rows.length+" rows");
		if(rs.rows && rs.rows.length>0) {
			let row = rs.rows[0];
			userInfo.found = true;
			userInfo.site = row.site;
			userInfo.userid = row.userid;
			userInfo.username = row.username;
			userInfo.email = row.email;
			userInfo.usernameen = (row.userename?row.userename:"")+" "+(row.useresurname?row.useresurname:"");
			userInfo.usernameth = (row.usertname?row.usertname:"")+" "+(row.usertsurname?row.usertsurname:"");
		}
		return userInfo;
	}
	
	public async getUserInfoById(db: KnDBConnector, id: string, context?: any) : Promise<KnUserInfo> {
		let userInfo : KnUserInfo = { found: false, userid: id, email: "" };
		let sql = new KnSQL("select tuser.site,tuser.userid,tuser.username,tuserinfo.email,");
		sql.append("tuserinfo.userename,tuserinfo.useresurname,tuserinfo.usertname,tuserinfo.usertsurname ");
		sql.append("from tuser,tuserinfo ");
		sql.append("where tuser.userid = tuserinfo.userid ");
		sql.append("and tuser.userid = ?userid ");
		sql.set("userid",id);
		this.logger.info(this.constructor.name+".getUserInfoById",sql);
		let rs = await sql.executeQuery(db,context);
		this.logger.debug(this.constructor.name+".getUserInfoById","effected "+rs.rows.length+" rows");
		if(rs.rows && rs.rows.length>0) {
			let row = rs.rows[0];
			userInfo.found = true;
			userInfo.site = row.site;
			userInfo.userid = row.userid;
			userInfo.username = row.username;
			userInfo.email = row.email;
			userInfo.usernameen = (row.userename?row.userename:"")+" "+(row.useresurname?row.useresurname:"");
			userInfo.usernameth = (row.usertname?row.usertname:"")+" "+(row.usertsurname?row.usertsurname:"");
		}
		return userInfo;
	}

	public async composeMailMessage(db: KnDBConnector, record: any, eng: boolean = true, template: string = "USER_FORGOT", templatetype: string = "MAIL_NOTIFY") : Promise<[string,KnTemplateInfo|undefined]> {
		let msg = undefined;
		let noti = new KnNotifyConfig();
		let tmp = await noti.getConfigTemplate(db, template, templatetype);
		if(tmp) {
			msg = eng?tmp.contents:tmp.contexts;
		}
		if(!msg || msg.trim().length==0) {
			msg = "Dear, ${userfullname}.<br/>";
			msg += "Confirm your password was changed.<br/><br/>";
			msg += "user = ${username}<br/>"
			msg += "password = ${userpassword}<br/><br/>";
			msg += "yours sincerely,<br/>";
			msg += "Administrator<br/>";
		}
		return [Utilities.translateVariables(msg, record),tmp];	
	}

	public async performForgotPassword(context: KnContextInfo, model: KnModel, db: KnDBConnector, userInfo: KnUserInfo, date?: Date) : Promise<PasswordVerify> {
		let verify = await this.forgotPassword(db,userInfo,date);
		this.logger.debug(this.constructor.name+".performForgotPassword: verify",verify);
		if(!verify.result) {
			return Promise.reject(new VerifyError(verify.msg as string,HTTP.NOT_ACCEPTABLE,verify.errno));
		} else {
			this.logger.debug(this.constructor.name+".performForgotPassword: send mail",userInfo.username+" : "+userInfo.usernameen);
			let record = {userfullname: userInfo.usernameen, username: userInfo.username, userpassword: verify.args};
			let [msg,tmp] = await this.composeMailMessage(db, record, userInfo.info?.eng);
			this.mailing(context, {email: userInfo.email, subject: tmp?tmp.subjecttitle:"Confirm Password Changed", message: msg});
		}
		return Promise.resolve(verify);
	}

	public async forgotPassword(db: KnDBConnector, info: KnUserInfo, date?: Date) : Promise<PasswordVerify> {
		let result : PasswordVerify = { result: false, msg: null, errno: 0, args: null };
		try {
			await db.beginWork();
			try {
				let pwd = PasswordLibrary.createNewPassword();
				let plib : PasswordLibrary = new PasswordLibrary();
				await plib.updateTemporaryPassword(db,info.userid,pwd,info.site,date);            
				await db.commitWork();    
				result.result = true;
				result.args = pwd;
			} catch(err : any) {
				this.logger.error(this.constructor.name,err);
				result.result = false;
				result.errno = -5000;
				if(err.errno) result.errno = err.errno;
				if (typeof err === "string") {
					result.msg = err;
				} else {
					result.msg = err.message;
				}
				await db.rollbackWork();
			}
		} catch(ex : any) {
			this.logger.error(this.constructor.name,ex);
			result.result = false;
			result.errno = -5100;
			if(ex.errno) result.errno = ex.errno;
			if (typeof ex === "string") {
				result.msg = ex;
			} else {
				result.msg = ex.message;
			}
		}
		return Promise.resolve(result);
	}

}
