import { KnModel } from "@willsofts/will-db";
import { Utilities } from "@willsofts/will-util";
import { HTTP } from "@willsofts/will-api";
import { KnDBConnector, KnSQL, KnResultSet, KnRecordSet } from "@willsofts/will-sql";
import { TknSchemeHandler, TknDataTableHandler, VerifyError, KnContextInfo, KnDataTable } from "@willsofts/will-core";
import { KnCategory } from "../utils/KnCategory";

export class TknProfileHandler extends TknSchemeHandler {
	public model : KnModel = { name: "tuserinfo", alias: { privateAlias: this.section } };

    //declared addon actions name
    public handlers = [ {name: "get"}, {name: "edit"}, {name: "contents"} ];

    public async contents(context: KnContextInfo) : Promise<KnResultSet> {
		return this.callFunctional(context, {operate: "contents", raw: false}, this.doContents);
    }

    /* override to handle launch router when invoked from menu */
	protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
		this.logger.debug(this.constructor.name+".doExecute: params",context.params);
        let vi = this.validateParameters(context.params,"userid");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
		let userid = context.params.userid;
		let db = this.getPrivateConnector(model);
		try {
			let settings = KnCategory.getSetting(context, undefined, "tlanguage");
            let handler = new TknDataTableHandler();
            let ds = await handler.getDataCategory(db, settings, true, context);
			let rs = await this.getUserProfile(db,userid,context);
			let data = {action: "execute", entity: ds, dataset: this.createRecordSet(rs)};
			return await this.createCipherData(context, "execute", data);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
		}
	}

    protected override async doGet(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
		this.logger.debug(this.constructor.name+".doGet: params",context.params);
        let vi = this.validateParameters(context.params,"userid");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
		let userid = context.params.userid;
		let db = this.getPrivateConnector(model);
		try {
			let rs = await this.getUserProfile(db,userid,context);
			return await this.createCipherData(context, "get", this.createRecordSet(rs));
			//return this.createRecordSet(rs);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
		}
	}

	public async getUserProfile(db: KnDBConnector, userid: string, context?: any) : Promise<KnResultSet> {
		let sql = new KnSQL("select tuserinfo.userid,tuserinfo.site,tuserinfo.userename,tuserinfo.useresurname,");
		sql.append("tuserinfo.usertname,tuserinfo.usertsurname,tuserinfo.displayname,");
		sql.append("tuserinfo.email,tuserinfo.mobile,tuserinfo.lineid,tuserinfo.langcode,tuserinfo.gender ");
		sql.append("from tuserinfo ");
		sql.append("where tuserinfo.userid = ?userid ");
		sql.set("userid",userid);
		let rs = await sql.executeQuery(db, context);
		this.logger.debug(this.constructor.name+".getUserProfile","effected "+rs.rows.length+" rows.");
		return Promise.resolve(rs);
	}

    protected async doContents(context: KnContextInfo, model: KnModel) : Promise<KnResultSet> {
		this.logger.debug(this.constructor.name+".doContents: params",context.params);
		let pcontents = context.params.usercontents;
		let atoken = await this.getAuthenToken(context, true, true);
		if (atoken != undefined) {
			let db = this.getPrivateConnector(model);
			try {
				if(Utilities.isString(pcontents) && pcontents!="") {
					pcontents = JSON.parse(pcontents);
				}
				let rs = await this.processUpdateUserContents(db,atoken.identifier,pcontents?JSON.stringify(pcontents):undefined, context);
				return await this.createCipherData(context, "contents", this.createRecordSet(rs));
			} catch(ex: any) {
				this.logger.error(this.constructor.name,ex);
				return Promise.reject(this.getDBError(ex));
			} finally {
				if(db) db.close();
			}
		} else {
			return Promise.reject(new VerifyError("Token undefined",HTTP.UNAUTHORIZED,-16002));
		}
	}

	public async processUpdateUserContents(db: KnDBConnector, useruuid: string, usercontents?: string, context?: any) : Promise<KnResultSet> {
		let sql = new KnSQL("select userid from tusertoken where useruuid = ?useruuid ");
		sql.set("useruuid",useruuid);
		let rs = await sql.executeQuery(db, context);
		this.logger.debug(this.constructor.name+".processUpdateUserContents","effected "+rs.rows.length+" rows.");
		if(rs.rows && rs.rows.length>0) {
			let userid = rs.rows[0].userid;
			sql.clear();
			sql.append("update tuserinfo set usercontents = ?usercontents where userid = ?userid ");
			sql.set("usercontents",usercontents);
			sql.set("userid",userid);
			rs = await sql.executeUpdate(db, context);
			this.logger.debug(this.constructor.name+".processUpdateUserContents","affected "+rs.rows.affectedRows+" rows.");
		}
		return Promise.resolve(rs);
	}

	protected override async doUpdate(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
		this.logger.debug(this.constructor.name+".doUpdate: params",context.params);
        let vi = this.validateParameters(context.params,"userid");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
		let token = await this.getAuthenToken(context, false, false);
		let db = this.getPrivateConnector(model);
		try {
			let knsql = new KnSQL();
			knsql.append("update tuserinfo set userename=?userename, useresurname=?useresurname, ");
			knsql.append("usertname=?usertname, usertsurname=?usertsurname, displayname=?displayname, ");
			knsql.append("email=?email, mobile=?mobile, lineid=?lineid, langcode=?langcode, ");
			knsql.append("editdate=?editdate, edittime=?edittime, edituser=?edituser ");
			knsql.append("where userid = ?userid ");
			knsql.set("userename",context.params.userename);
			knsql.set("useresurname",context.params.useresurname);
			knsql.set("usertname",context.params.usertname);
			knsql.set("usertsurname",context.params.usertsurname);
			knsql.set("displayname",context.params.displayname);
			knsql.set("email",context.params.email);
			knsql.set("mobile",context.params.mobile);
			knsql.set("lineid",context.params.lineid);
			knsql.set("langcode",context.params.langcode);
			knsql.set("userid",context.params.userid);
			knsql.set("editdate",Utilities.now(),"DATE");
			knsql.set("edittime",Utilities.now(),"TIME");
			knsql.set("edituser",token?.accessor);
			let rs = await knsql.executeUpdate(db, context);
			//return Promise.resolve(this.createRecordSet(rs));
			return await this.createCipherData(context, "update", this.createRecordSet(rs));
		} catch(ex: any) {
			this.logger.error(this.constructor.name,ex);
			return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
		}
	}

	public async processUpdateUserInfo(db: KnDBConnector, useruuid: string, displayname?: string, context?: any) : Promise<KnResultSet> {
		let sql = new KnSQL("select userid from tusertoken where useruuid = ?useruuid ");
		sql.set("useruuid",useruuid);
		let rs = await sql.executeQuery(db, context);
		this.logger.debug(this.constructor.name+".processUpdateUserInfo","effected "+rs.rows.length+" rows.");
		if(rs.rows && rs.rows.length>0) {
			let userid = rs.rows[0].userid;
			sql.clear();
			sql.append("update tuserinfo set displayname = ?displayname where userid = ?userid ");
			sql.set("displayname",displayname);
			sql.set("userid",userid);
			rs = await sql.executeUpdate(db, context);
			this.logger.debug(this.constructor.name+".processUpdateUserInfo","affected "+rs.rows.affectedRows+" rows.");
		}
		return Promise.resolve(rs);
	}

	protected override async doEdit(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
		this.logger.debug(this.constructor.name+".doEdit: params",context.params);
		let pdisplayname = context.params.displayname;
		if(!pdisplayname || pdisplayname.trim().length==0) {
			return Promise.reject(new VerifyError("Parameters not found",HTTP.NOT_ACCEPTABLE,-16061));
		}
		let atoken = await this.getAuthenToken(context, true, true);
		if (atoken != undefined) {
			let db = this.getPrivateConnector(model);
			try {
				let rs = await this.processUpdateUserInfo(db,atoken.identifier,pdisplayname, context);
				return await this.createCipherData(context, "edit", this.createRecordSet(rs));
				//return Promise.resolve(this.createRecordSet(rs));
			} catch(ex: any) {
				this.logger.error(this.constructor.name,ex);
				return Promise.reject(this.getDBError(ex));
			} finally {
				if(db) db.close();
			}
		} else {
			return Promise.reject(new VerifyError("Token undefined",HTTP.UNAUTHORIZED,-16002));
		}
	}

}
