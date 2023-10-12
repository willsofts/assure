import { KnModel } from "@willsofts/will-db";
import { KnSQL, KnDBConnector, KnResultSet } from '@willsofts/will-sql';
import { AuthenToken, AuthenTokenData} from "@willsofts/will-lib";
import { HTTP } from "@willsofts/will-api";
import { v4 as uuid } from 'uuid';
import { VerifyError } from "../models/VerifyError";
import { KnUserToken } from "../models/KnUserToken";
import { KnAnonymousInfoContents, KnContextInfo, KnLoginInfoContents, KnLogoutInfoContents } from '../models/KnCoreAlias';
import { TknSchemeHandler } from "./TknSchemeHandler";
import { TknSigninHandler } from "./TknSigninHandler";

export class TknLoginHandler extends TknSchemeHandler {

    public model : KnModel = { name: "tusertoken", alias: { privateAlias: this.section } };

    //declared addon actions name
    public handlers = [ {name: "logincallback"}, {name: "logoutcallback"}, {name: "anonymouslogin"} ];

    public async logincallback(context: KnContextInfo) : Promise<KnLoginInfoContents> {
		return this.callFunctional(context, {operate: "logincallback", raw: false}, this.doLoginCallback);
	}

	public async logoutcallback(context: KnContextInfo) : Promise<KnLogoutInfoContents> {
		return this.callFunctional(context, {operate: "logoutcallback", raw: false}, this.doLogoutCallback);
	}

	public async anonymouslogin(context: KnContextInfo) : Promise<KnAnonymousInfoContents> {
		return this.callFunctional(context, {operate: "anonymouslogin", raw: false}, this.doAnonymousLogin);
	}

	protected async doLoginCallback(context: KnContextInfo, model: KnModel) : Promise<KnLoginInfoContents> {
		let pcode = context.params.code;
		let pnonce = context.params.nonce;
		let ptoken = context.params.token;
		let pplayUri = context.params.playUri;
		this.logger.debug(this.constructor.name+".doLoginCallback : uri="+pplayUri+", token="+ptoken);
		if (ptoken != undefined) {
			const atoken: AuthenTokenData = AuthenToken.verifyAuthenToken(ptoken as string, false);
			if (atoken.identifier == undefined) {
				return Promise.reject(new VerifyError("Token undefined",HTTP.UNAUTHORIZED,-16071));
			}
			let db = this.getPrivateConnector(model);
			try {
				return await this.processLogin(context,db,atoken.identifier,ptoken);
			} catch(ex: any) {
				this.logger.error(this.constructor.name,ex);
				return Promise.reject(this.getDBError(ex));
			} finally {
				if(db) db.close();	
			}
		} else {
			if(pnonce==undefined) {
				return Promise.reject(new VerifyError("Bad request",HTTP.BAD_REQUEST,-16072));
			}
			let db = this.getPrivateConnector(model);
			try {
				return await this.processLoginByNonce(context,db,""+pnonce,""+pcode);
			} catch(ex: any) {
				this.logger.error(this.constructor.name,ex);
				return Promise.reject(this.getDBError(ex));
			} finally {
				if(db) db.close();
			}				    
		}
	}

	public async processLogin(context: KnContextInfo, db: KnDBConnector, useruuid: string, token: string) : Promise<KnLoginInfoContents> {
		this.logger.debug(this.constructor.name+".processLogin: uuid="+useruuid);
		let sql = new KnSQL("select tusertoken.*,tuserinfo.userename,tuserinfo.useresurname,tuserinfo.email,tuserinfo.displayname,tuserinfo.usercontents ");
		sql.append("from tusertoken,tuserinfo ");
		sql.append("where tusertoken.useruuid = ?useruuid ");
		sql.append("and tusertoken.userid = tuserinfo.userid ");
		sql.set("useruuid",useruuid);
		this.logger.info(this.constructor.name+".processLogin",sql);
		let rs = await sql.executeQuery(db,context);
		this.logger.debug(this.constructor.name+".processLogin","effected "+rs.rows.length+" rows.");
		if(rs.rows && rs.rows.length>0) {
			return Promise.resolve(this.composeResponseInfo(rs.rows[0]));
		} else {
			return Promise.reject(new VerifyError("Not found",HTTP.UNAUTHORIZED,-16073));
		}	
	}

	public composeResponseInfo(row: any) : KnLoginInfoContents {
		let userinfo : Object = {};
		if(row.usercontents && row.usercontents.trim().length>0) {
			userinfo = JSON.parse(row.usercontents);
		}
		this.logger.debug(this.constructor.name+".composeResponseInfo: userinfo",userinfo);
		let accessinfo : Object = {};
		if(row.accesscontents && row.accesscontents.trim().length>0) {
			accessinfo = JSON.parse(row.accesscontents);
		}
		this.logger.debug(this.constructor.name+".composeResponseInfo: accessinfo",accessinfo);
		let response: KnLoginInfoContents = { 
			authToken : row.authtoken, 
			userUuid: row.useruuid, 
			textures: [], 
			email: row.email, 
			displayName: row.displayname, 
			userPrincipalName: row.userename+" "+row.useresurname, 
			userContents: userinfo,
			accessContents: accessinfo,
			info: { 
				prime: row.prime, 
				generator: row.generator,
				publickey: row.publickey,
			}	
		};
		return response;
	}

	public async processLoginByNonce(context: KnContextInfo, db: KnDBConnector, nonce: string, code: string) : Promise<KnLoginInfoContents> {
		this.logger.debug(this.constructor.name+".processLoginByNonce: nonce="+nonce+", code="+code);
		let sql = new KnSQL("select tusertoken.*,tuserinfo.userename,tuserinfo.useresurname,tuserinfo.email,tuserinfo.displayname,tuserinfo.usercontents ");
		sql.append("from tusertoken,tuserinfo ");
		sql.append("where tusertoken.nonce = ?nonce ");
		sql.append("and tusertoken.outdate is null and tusertoken.outtime is null ");
		sql.append("and tusertoken.userid = tuserinfo.userid ");
		sql.set("nonce",nonce);
		this.logger.info(this.constructor.name+".processLoginByNonce",sql);
		let rs = await sql.executeQuery(db,context);
		this.logger.debug(this.constructor.name+".processLoginByNonce","effected "+rs.rows.length+" rows.");
		if(rs.rows && rs.rows.length>0) {
			return Promise.resolve(this.composeResponseInfo(rs.rows[0]));
		} else {
			return Promise.reject(new VerifyError("Not found",HTTP.UNAUTHORIZED,-16074));
		}	
	}

	protected async doLogoutCallback(context: KnContextInfo, model: KnModel) : Promise<KnLogoutInfoContents> {
		let ptoken = context.params.token;
		this.logger.debug(this.constructor.name+".doLogoutCallback : token="+ptoken);
		let response: KnLogoutInfoContents = { authToken : ptoken?ptoken:"" };
		this.logger.debug(this.constructor.name+".doLogoutCallback",response);
		if (ptoken != undefined) {
			let db = this.getPrivateConnector(model);
			try {
				await this.processLogout(db,""+ptoken, context);
			} catch(ex: any) {
				this.logger.error(this.constructor.name,ex);
				return Promise.reject(this.getDBError(ex));
			} finally {
				if(db) db.close();
			}
		}
		return Promise.resolve(response);
	}

	public async processLogout(db: KnDBConnector, token: string, context?: any) : Promise<KnResultSet> {
		let now = new Date();
		let sql = new KnSQL("update tusertoken set outdate = ?outdate, outtime = ?outtime ");
		sql.append("where authtoken = ?authtoken ");
		sql.set("outdate",now,"DATE");
		sql.set("outtime",now,"TIME");
		sql.set("authtoken",token);
		this.logger.info(this.constructor.name+".processLogout",sql);
		let rs = await sql.executeQuery(db,context);
		this.logger.debug(this.constructor.name+".processLogout","affected "+rs.rows.affectedRows+" rows.");
		return Promise.resolve(rs);
	}

	public doAnonymousLogin(context: KnContextInfo, model: KnModel) : Promise<KnAnonymousInfoContents> {
		let identifier : string = uuid();
		let site = context.params.site;
		let accessor = context.params.accessor;
		let authdata = {identifier, site, accessor};
		let authtoken : string = AuthenToken.createAuthenToken(authdata);
		let response : KnAnonymousInfoContents = { userUuid: identifier, authToken: authtoken };
		this.saveAnonymousToken(context, model, authdata, authtoken);
		return Promise.resolve(response);
	}

	public async saveAnonymousToken(context: KnContextInfo, model: KnModel, authdata: AuthenTokenData, authtoken: string) : Promise<KnUserToken> {
		let db = this.getPrivateConnector(model);
		try {
			let handler = new TknSigninHandler();
			return await handler.createUserToken(db,{userid: authdata.accessor as string, site: authdata.site},authdata.identifier,authtoken,"A");
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();	
		}
	}

}
