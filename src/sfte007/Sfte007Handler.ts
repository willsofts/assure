import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnSQLInterface, KnRecordSet, KnSQL, KnResultSet } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { KnUtility, VerifyError, KnValidateInfo, KnContextInfo, KnNotifyConfig, KnDataTable } from '@willsofts/will-core';
import { Utilities } from "@willsofts/will-util";
import { MailLibrary, MailInfo } from "@willsofts/will-lib";
import { TknOperateHandler } from '../handlers/TknOperateHandler';
import { OPERATE_HANDLERS } from "@willsofts/will-serv";

export interface KnUserTypeInfo {
    groupname: string;
    usertype: string;
    level: number;
    approveflag: string;
}

export interface KnUserChangedInfo {
    site: string;
    email: string;
    userename: string;
    usertname: string;
    updateflag: boolean;
    fromusername?: string;
    tousername?: string;
}

export class Sfte007Handler extends TknOperateHandler {

    public progid = "sfte007";
    public model : KnModel = { 
        name: "tuserinfo", 
        alias: { privateAlias: this.section }, 
        fields: {
            userid: { type: "STRING", key: true },
            username: { type: "STRING", calculated: true },
            site: { type: "STRING" },
            userbranch: { type: "STRING" },
            usertname: { type: "STRING" },
            usertsurname: { type: "STRING" },
            userename: { type: "STRING" },
            useresurname: { type: "STRING" },
            displayname: { type: "STRING" },
            email: { type: "STRING" },
            status: { type: "STRING", calculated: true },
            siteflag: { type: "STRING", calculated: true },
            branchflag: { type: "STRING", calculated: true },
            userbranches: { type: "STRING", calculated: true },
            userroles: { type: "STRING", calculated: true },
            usergroups: { type: "STRING", calculated: true },
            usersites: { type: "STRING", calculated: true },
            sitedesc: { type: "STRING", calculated: true },
            factorid: { type: "STRING", calculated: true },
            factorflag: { type: "STRING", calculated: true },
        },
        //prefix naming with table name when select ex. table.column1,table.column2,...
        prefixNaming: true
    };
    public handlers = OPERATE_HANDLERS.concat([
        {name: "resetfactor"}
    ]);

    /* try to validate fields for insert, update, delete, retrieve */
    protected override validateRequireFields(context: KnContextInfo, model: KnModel, action: string) : Promise<KnValidateInfo> {
        let vi = this.validateParameters(context.params,"userid");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        return Promise.resolve(vi);
    }

    protected override buildFilterQuery(context: KnContextInfo, model: KnModel, knsql: KnSQLInterface, selector: string, action?: string, subaction?: string): KnSQLInterface {
        if(this.isCollectMode(action)) {
            let eng = KnUtility.isEnglish(context);
            let params = context.params;
            let counting = KnOperation.COUNT==subaction;
            knsql.append(selector);
            if(!counting) {
                knsql.append(",tuser.username,tuser.status,tuser.siteflag,tuser.branchflag,");
                if(eng) {
                    knsql.append("tcomp.nameen as sitedesc ");
                } else {
                    knsql.append("tcomp.nameth as sitedesc ");
                }        
            }
            knsql.append(" from ");
            knsql.append(model.name);
            knsql.append(" join tuser on tuser.userid = tuserinfo.userid ");
            if(params.username && params.username!="") {
                knsql.append("and tuser.username LIKE ?username");
                knsql.set("username","%"+params.username+"%");
            }
            if(!counting) {
                knsql.append(" left join tcomp on tcomp.site = tuserinfo.site ");
            }
            let filter = " where ";
            if(params.site && params.site!="") {
                knsql.append(filter).append(model.name).append(".site = ?site");
                knsql.set("site",params.site);
                filter = " and ";
            }
            if(params.usertname && params.usertname!="") {
                knsql.append(filter).append(model.name).append(".usertname LIKE ?usertname");
                knsql.set("usertname","%"+params.usertname+"%");
                filter = " and ";
            }
            if(params.usertsurname && params.usertsurname!="") {
                knsql.append(filter).append(model.name).append(".usertsurname LIKE ?usertsurname");
                knsql.set("usertsurname","%"+params.usertsurname+"%");
                filter = " and ";
            }
            return knsql;    
        }
        return super.buildFilterQuery(context, model, knsql, selector, action, subaction);
    }

    protected override async doCategories(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            return await this.performCategories(context, model, db);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    protected async performCategories(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnDataTable> {
        let settings = this.getCategorySetting(context, "tcompbranch", "tuserstatus", "trole", "tgroup");
        return await this.getDataCategories(context, db, settings);
    }

    /* override doExecute to handle launch router when invoked from menu */
    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let dt = this.createDataTable(KnOperation.EXECUTE);
        let ds = this.emptyDataSet();
        dt.dataset = ds;
        return dt;
    }

    protected override async doRetrieving(context: KnContextInfo, model: KnModel, action: string = KnOperation.RETRIEVE): Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.performRetrieving(context, model, db);
            if(rs.rows.length>0) {
                let row = this.transformData(rs.rows[0]);
                return this.createDataTable(KnOperation.RETRIEVE, row);
            }
            return this.recordNotFound();
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    protected async performRetrieving(context: KnContextInfo, model: KnModel, db: KnDBConnector): Promise<KnRecordSet> {
        let eng = KnUtility.isEnglish(context);
        let knsql = new KnSQL();
        knsql.append("select ").append(this.buildSelectField(context,model)).append(",");
        knsql.append("tuser.username,tuser.status,tuser.siteflag,tuser.branchflag,");
        if(eng) {
            knsql.append("tcomp.nameen as sitedesc ");
        } else {
            knsql.append("tcomp.nameth as sitedesc ");
        }                
        knsql.append("from tuserinfo ");
        knsql.append("join tuser on tuser.userid = tuserinfo.userid ");
        knsql.append("left join tcomp on tcomp.site = tuserinfo.site ");
        knsql.append("where tuserinfo.userid = ?userid ");
        knsql.set("userid",context.params.userid);
        this.logger.debug(this.constructor.name,knsql);
        let rs = await knsql.executeQuery(db,context);
        if(rs.rows.length>0) {
            let row = rs.rows[0];
            let site = row.site;
            row.userbranches = [];
            knsql.clear();
            knsql.append("select branch from tuserbranch ");
            knsql.append("where site = ?site and userid = ?userid ");
            knsql.set("site",site);
            knsql.set("userid",context.params.userid);
            let ars = await knsql.executeQuery(db,context);
            if(ars.rows.length>0) {
                for(let r of ars.rows) {
                    row.userbranches.push(r.branch);
                }
            }
            row.userroles = [];
            knsql.clear();
            knsql.append("select roleid from tuserrole where userid = ?userid ");
            knsql.set("userid",context.params.userid);
            ars = await knsql.executeQuery(db,context);
            if(ars.rows.length>0) {
                for(let r of ars.rows) {
                    row.userroles.push(r.roleid);
                }
            }
            row.usergroups = [];
            knsql.clear();
            knsql.append("select groupname from tusergrp where userid = ?userid ");
            knsql.set("userid",context.params.userid);
            ars = await knsql.executeQuery(db,context);
            if(ars.rows.length>0) {
                for(let r of ars.rows) {
                    row.usergroups.push(r.groupname);
                }
            }
            knsql.clear();
            knsql.append("select factorid,factorflag from tuserfactor where userid = ?userid ");
            knsql.set("userid",context.params.userid);
            ars = await knsql.executeQuery(db,context);
            if(ars.rows.length>0) {
                let r = ars.rows[0];
                row.factorid = r.factorid;
                row.factorflag = r.factorflag;
            }
        }
        return this.createRecordSet(rs);
    }
    
    /**
     * Override for search action (return data collection)
     * @param context 
     * @param model 
     * @returns KnDataTable
     */
    public override async getDataSearch(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let rs = await this.doCollecting(context, model);
        return this.createDataTable(KnOperation.COLLECT, this.createRecordSet(rs), {}, "sfte007/sfte007_data");
    }

    /**
     * Override for retrieval action (return record not found error if not found any record)
     * @param context 
     * @param model 
     * @returns KnDataTable
     */
    public override async getDataRetrieval(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let rs =  await this.performRetrieving(context, model, db);
            if(rs.rows.length>0) {
                let row = this.transformData(rs.rows[0]);
                let dt = await this.performCategories(context, model, db);
                return this.createDataTable(KnOperation.RETRIEVAL, row, dt.entity, "sfte007/sfte007_dialog");
            }
            return this.recordNotFound();
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
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

    /**
     * Override in order to update records
     */
    protected override async doUpdating(context: any, model: KnModel): Promise<KnResultSet> {
        let result = this.createRecordSet();
		let db = this.getPrivateConnector(model);
		try {
            let eng = KnUtility.isEnglish(context);
            let site = context.params.site || this.userToken?.site;
            let utmap = await this.getUserTypeMap(db, context);
            let rolemap = await this.getUserRoleMap(db, site, context);
            let info : KnUserChangedInfo = { site: site, email: "", userename: "", usertname: "", updateflag: false, tousername: context.params.username };
            let knsql = new KnSQL();
            knsql.append("select username from tuser where userid = ?userid ");
            knsql.set("userid", context.params.userid);
            let rs = await knsql.executeQuery(db,context);
            if(rs && rs.rows.length>0) {
                info.fromusername = rs.rows[0].username;
                info.updateflag = !Utilities.equalsIgnoreCase(info.fromusername, info.tousername);
            }
            if(info.updateflag) {
                knsql.clear();
                knsql.append("select email,usertname,usertsurname,userename,useresurname ");
				knsql.append("from tuserinfo where userid=?userid ");
                knsql.set("userid", context.params.userid);
                rs = await knsql.executeQuery(db,context);
                if(rs && rs.rows.length>0) {
                    let row = rs.rows[0];
                    info.email = row.email;
                    info.userename = (row.userename?row.userename:"")+" "+(row.useresurname?row.useresurname:"");
                    info.usertname = (row.usertname?row.usertname:"")+" "+(row.usertsurname?row.usertsurname:"");
                }
            }
            result = await this.updateUserTable(context, db, info, utmap, rolemap);
            if(info.updateflag && (info.email && info.email.trim().length>0)) {
                let msg = undefined;
                let noti = new KnNotifyConfig();
                let tmp = await noti.getConfigTemplate(db, "USER_INFO", "MAIL_CHANGE");
                if(tmp) {
                    msg = eng?tmp.contents:tmp.contexts;
                }
                if(!msg || msg.trim().length==0) {
                    msg = "Dear, ${usertname}<br/><br/>";
                    msg += "Your access user name was changed.<br/>";
                    msg += "From : ${fromusername}<br/>";
                    msg += "To : ${tousername}<br/>";
                    msg += "You can try out with the new access into the system.<br/><br/>";
                    msg += "Should you encounter any difficulties, please contact system administrator.<br/>"
                    msg += "<br/>Regards,<br/>";
                    msg += "Administrator<br/>";
                }
                msg = Utilities.translateVariables(msg, info);
                this.doSendMail(context, model, {email: info.email, subject: tmp?tmp.subjecttitle:"Account Changed", message: msg});
            }
		} catch(ex: any) {
			this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
		}
        return result;
    }

    public async updateUserTable(context: KnContextInfo, db: KnDBConnector, info: KnUserChangedInfo, utmap: Map<string,KnUserTypeInfo>, rolemap: Map<string,string>) : Promise<KnRecordSet> {  
        let result = this.createRecordSet();
        await db.beginWork();
        try {
            let curdate = Utilities.now();
            let status = context.params.status && context.params.status.trim().length>0?context.params.status:"A";
            let branchflag = context.params.branchflag && context.params.branchflag.trim().length>0?context.params.branchflag:"0";
            let siteflag = context.params.siteflag && context.params.siteflag.trim().length>0?context.params.siteflag:"0";
            let ut = await this.updateUserInfo(context, db, info.site, utmap, rolemap);
            let knsql = new KnSQL();
            knsql.append("update tuser set status = ?status, ");
            knsql.append("approveflag = ?approveflag, ");
            knsql.append("branchflag = ?branchflag, ");
            knsql.append("siteflag = ?siteflag, ");
            if(ut.usertype!="") {
                knsql.append("usertype = ?usertype, ");
            }
            if(info.updateflag) {
                knsql.append("username = ?username, ");
            }
            knsql.append("editdate = ?editdate, edittime = ?edittime, edituser = ?edituser ");
            knsql.append("where userid = ?userid ");
            knsql.set("userid", context.params.userid);
            knsql.set("approveflag", ut.approveflag);
            knsql.set("usertype", ut.usertype);
            knsql.set("status", status);
            knsql.set("branchflag", branchflag);
            knsql.set("siteflag", siteflag);
            knsql.set("username", context.params.username);
            knsql.set("editdate", curdate, "DATE");
            knsql.set("edittime", curdate, "TIME");
            knsql.set("edituser", this.userToken?.userid);
            let rs = await knsql.executeUpdate(db,context);

            knsql.clear();
            knsql.append("update tuserinfo set inactive = ?inactive, ");
            knsql.append("editdate = ?editdate, edittime = ?edittime, edituser = ?edituser, ");
            knsql.append("remarks = ?remarks ");
            knsql.append("where userid = ?userid ");
            knsql.set("userid", context.params.userid);
            knsql.set("inactive", "C"==status?"1":"0");
            knsql.set("editdate", curdate, "DATE");
            knsql.set("edittime", curdate, "TIME");
            knsql.set("edituser", this.userToken?.userid);
            knsql.set("remarks", this.progid);
            rs = await knsql.executeUpdate(db,context);	

            knsql.clear();
            knsql.append("insert into tuserinfohistory ");
            knsql.append("select * from tuserinfo where userid = ?userid ");
            knsql.set("userid", context.params.userid);
            await knsql.executeUpdate(db,context);	
        
            result = this.createRecordSet(rs);
            await db.commitWork(); 
            return result;                   
        } catch(ex: any) {
            db.rollbackWork();
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(ex);
        }
    }

    public async updateUserInfo(context: KnContextInfo, db: KnDBConnector, site: string, utmap: Map<string,KnUserTypeInfo>, rolemap: Map<string,string>) : Promise<KnUserTypeInfo> {  
        let result : KnUserTypeInfo = { groupname: "", usertype: "", level: 0, approveflag: "" };            
        let knsql = new KnSQL();
        /*
        knsql.append("delete from tusercomp where userid = ?userid ");
        knsql.set("userid",context.params.userid);
        await knsql.executeUpdate(db);            
        knsql.clear();
        knsql.append("insert into tusercomp(userid,site) values(?userid,?site)");
        if(context.params.usersites) {
            let usersites = context.params.usersites;
            if(Utilities.isString(usersites)) {
                usersites = [usersites];
            }
            for(let usersite of usersites) {
                knsql.clearParameter();
                knsql.set("userid",context.params.userid);
                knsql.set("site",usersite);
                await knsql.executeUpdate(db);
            }
        }
        */
        knsql.clear();
        knsql.append("delete from tuserbranch where site = ?site and userid = ?userid ");
        knsql.set("site",site);
        knsql.set("userid",context.params.userid);
        await knsql.executeUpdate(db,context);
        knsql.clear();
        knsql.append("insert into tuserbranch(site,branch,userid) values(?site,?branch,?userid)");
        if(context.params.userbranches) {
            let userbranches = context.params.userbranches;
            if(Utilities.isString(userbranches)) {
                userbranches = [userbranches];
            }
            for(let userbranch of userbranches) {
                knsql.clearParameter();
                knsql.set("site",site);
                knsql.set("branch",userbranch);
                knsql.set("userid",context.params.userid);
                await knsql.executeUpdate(db,context);
            }
        }

        let approveflag = "0";
        knsql.clear();
        knsql.append("delete from tuserrole where userid = ?userid ");
        knsql.set("userid",context.params.userid);
        await knsql.executeUpdate(db,context);
        knsql.clear();
        knsql.append("insert into tuserrole(userid,roleid) values(?userid,?roleid)");
        if(context.params.userroles) {
            let userroles = context.params.userroles;
            if(Utilities.isString(userroles)) {
                userroles = [userroles];
            }
            for(let userrole of userroles) {
                let flag = rolemap.get(userrole);
                if("1"==flag) {
                    approveflag = flag;
                }
                knsql.clearParameter();
                knsql.set("userid",context.params.userid);
                knsql.set("roleid",userrole);
                await knsql.executeUpdate(db,context);
            }
        }

        knsql.clear();
        knsql.append("delete from tusergrp where userid = ?userid ");
        knsql.set("userid",context.params.userid);
        await knsql.executeUpdate(db,context);
        knsql.clear();
        knsql.append("insert into tusergrp(userid,groupname) values(?userid,?groupname)");
        if(context.params.usergroups) {
            let usergroups = context.params.usergroups;
            if(Utilities.isString(usergroups)) {
                usergroups = [usergroups];
            }
            for(let usergroup of usergroups) {
                let ut = utmap.get(usergroup);
                if(ut) {
                    if(result.level < ut.level) {
                        result = Object.assign(result,ut);
                    }
                }
                knsql.clearParameter();
                knsql.set("userid",context.params.userid);
                knsql.set("groupname",usergroup);
                await knsql.executeUpdate(db,context);
            }
        }
        result.approveflag = approveflag;
        return result;                   
    }
    
    public async getUserTypeMap(db: KnDBConnector, context?: any) : Promise<Map<string,KnUserTypeInfo>> {
        let utmap = new Map<string,KnUserTypeInfo>();
        let knsql = new KnSQL();
        knsql.append("select tgroup.groupname,tgroup.usertype,tusertype.level from tgroup ");
        knsql.append("left join tusertype on tusertype.usertype = tgroup.usertype ");
        let rs = await knsql.executeQuery(db,context);
        if(rs && rs.rows.length>0) {
            for(let r of rs.rows) {
                let ut : KnUserTypeInfo = { groupname: r.groupname, usertype: r.usertype, level: r.level, approveflag: "" };
                utmap.set(ut.groupname,ut);
            }
        }
        return utmap;
    }

    public async getUserRoleMap(db: KnDBConnector, site: string, context?: any) : Promise<Map<string,string>> {
        let rolemap = new Map<string,string>();
        let knsql = new KnSQL();
        knsql.append("select roleid,approveflag from trole ");
        knsql.append("where site = ?site ");
        knsql.set("site", site);
        let rs = await knsql.executeQuery(db,context);
        if(rs && rs.rows.length>0) {
            for(let r of rs.rows) {
                rolemap.set(r.roleid,r.approveflag);
            }
        }
        return rolemap;            
    }

    //Override in order to prevent delete records
    protected override async doClearing(context: any, model: KnModel): Promise<KnResultSet> {
        return this.notImplementation();
    }  

    //Override in order to prevent create/insert new records
    protected override async doCreating(context: any, model: KnModel): Promise<KnResultSet> {
        return this.notImplementation();
    }
    
    public async resetfactor(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: KnOperation.REMOVE, raw: false}, this.doResetFactor);
    }

    public async doResetFactor(context: KnContextInfo, model: KnModel) : Promise<any> {
        await this.validateRequireFields(context, model, KnOperation.REMOVE);
        let rs = await this.doResetFactoring(context, model, KnOperation.REMOVE);
        return await this.createCipherData(context, KnOperation.REMOVE, rs);
    }

    public async doResetFactoring(context: KnContextInfo, model: KnModel, action: string = KnOperation.REMOVE): Promise<KnResultSet> {
        let vi = this.validateParameters(context.params,"factorid");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        let result = this.createRecordSet();
		let db = this.getPrivateConnector(model);
		try {
            result = await this.deleteUserFactor(context, db);
		} catch(ex: any) {
			this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
		}
        return result;
    }

    public async deleteUserFactor(context: KnContextInfo, db: KnDBConnector) : Promise<KnRecordSet> {  
        let result = this.createRecordSet();
        await db.beginWork();
        try {
            let knsql = new KnSQL();
            knsql.append("insert into tuserfactorhistory ");
            knsql.append("select * from tuserfactor where factorid = ?factorid ");
            knsql.set("factorid", context.params.factorid);
            await knsql.executeUpdate(db,context);
            knsql.clear();
            knsql.append("delete from tuserfactor where factorid = ?factorid ");
            knsql.set("factorid", context.params.factorid);
            let rs = await knsql.executeUpdate(db,context);
            result = this.createRecordSet(rs);
            await db.commitWork(); 
            return result;                   
        } catch(ex: any) {
            db.rollbackWork();
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(ex);
        }
    }

}
