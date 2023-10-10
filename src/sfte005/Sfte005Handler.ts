import { v4 as uuid } from 'uuid';
import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnSQLInterface, KnRecordSet, KnSQL, KnResultSet } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { KnUtility, KnPageUtility, VerifyError, KnValidateInfo, KnContextInfo, KnNotifyConfig, KnDataTable, KnTemplateInfo } from '@willsofts/will-core';
import { Utilities } from "@willsofts/will-util";
import { PasswordLibrary } from "@willsofts/will-lib";
import { DEFAULT_PRIVILEGES } from "../utils/EnvironmentVariable";
import { TknOperateHandler } from '../handlers/TknOperateHandler';

export class Sfte005Handler extends TknOperateHandler {

    public progid = "sfte005";
    public model : KnModel = { 
        name: "tuser", 
        alias: { privateAlias: this.section }, 
        fields: {
            userid: { type: "STRING", key: true },
            username: { type: "STRING" },
            site: { type: "STRING" },
            userbranch: { type: "STRING", calculated: true },
            usertname: { type: "STRING", calculated: true },
            usertsurname: { type: "STRING", calculated: true },
            userename: { type: "STRING", calculated: true },
            useresurname: { type: "STRING", calculated: true },
            displayname: { type: "STRING", calculated: true },
            photoimage: { type: "STRING", calculated: true },
            email: { type: "STRING", calculated: true },
            gender: { type: "STRING", calculated: true },
            lineid: { type: "STRING", calculated: true },
            inactive: { type: "STRING", calculated: true },
            sitedesc: { type: "STRING", calculated: true }
        },
        //prefix naming with table name when select ex. table.column1,table.column2,...
        prefixNaming: true
    };

    /* try to validate fields for insert, update, delete, retrieve */
    protected override validateRequireFields(context: KnContextInfo, model: KnModel, action: string) : Promise<KnValidateInfo> {
        let pageutil = new KnPageUtility(this.progid,context);
        if(pageutil.isInsertMode(action)) return Promise.resolve({valid:true});
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
                knsql.append(",tuserinfo.userbranch,tuserinfo.usertname,tuserinfo.usertsurname,");
                knsql.append("tuserinfo.userename,tuserinfo.useresurname,");
                knsql.append("tuserinfo.email,tuserinfo.gender,tuserinfo.mobile,tuserinfo.lineid,");
                knsql.append("tuserinfo.photoimage,tuserinfo.inactive,tuserinfo.displayname,");
                if(eng) {
                    knsql.append("tcomp.nameen as sitedesc ");
                } else {
                    knsql.append("tcomp.nameth as sitedesc ");
                }        
            }
            knsql.append(" from ");
            knsql.append(model.name);
            knsql.append(", tuserinfo, tcomp ");
            knsql.append("where tuser.userid = tuserinfo.userid ");
            knsql.append("and tuser.site = tcomp.site ");        
            let filter = " and ";
            if(params.site && params.site!="") {
                knsql.append(filter).append(model.name).append(".site = ?site");
                knsql.set("site",params.site);
                filter = " and ";
            }
            if(params.username && params.username!="") {
                knsql.append(filter).append(model.name).append(".username LIKE ?username");
                knsql.set("username","%"+params.username+"%");
                filter = " and ";
            }
            if(params.usertname && params.usertname!="") {
                knsql.append(filter).append("tuserinfo.usertname LIKE ?usertname");
                knsql.set("usertname","%"+params.usertname+"%");
                filter = " and ";
            }
            if(params.usertsurname && params.usertsurname!="") {
                knsql.append(filter).append("tuserinfo.usertsurname LIKE ?usertsurname");
                knsql.set("usertsurname","%"+params.usertsurname+"%");
                filter = " and ";
            }
            if(params.email && params.email!="") {
                knsql.append(filter).append("tuserinfo.email LIKE ?email");
                knsql.set("email","%"+params.email+"%");
                filter = " and ";
            }
            if(params.mobile && params.mobile!="") {
                knsql.append(filter).append("tuserinfo.mobile LIKE ?mobile");
                knsql.set("mobile","%"+params.mobile+"%");
                filter = " and ";
            }
            if(params.gender && params.gender!="") {
                knsql.append(filter).append("tuserinfo.gender = ?gender");
                knsql.set("gender",params.gender);
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
        let settings = this.getCategorySetting(context, "tactive");
        return await this.getDataCategories(context, db, settings);
    }

    /* override doExecute to handle launch router when invoked from menu */
    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let dt = await this.doCategories(context, model);
        let ds = this.emptyDataSet();
        dt.action = KnOperation.EXECUTE;
        dt.dataset = ds;
        return dt;
    }

    protected override async doRetrieving(context: KnContextInfo, model: KnModel, action: string = KnOperation.RETRIEVE): Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.performRetrieving(context, model, db);
            if(rs.rows.length>0) {
                let row = this.transformData(rs.rows[0]);
                let result = {action: action, entity: {}, dataset: row};
                return result;
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
        let knsql = new KnSQL();
        knsql.append("select ").append(this.buildSelectField(context,model)).append(",");
        knsql.append("tuserinfo.userbranch,tuserinfo.usertname,tuserinfo.usertsurname,");
        knsql.append("tuserinfo.userename,tuserinfo.useresurname,");
        knsql.append("tuserinfo.email,tuserinfo.gender,tuserinfo.mobile,tuserinfo.lineid,");
        knsql.append("tuserinfo.photoimage,tuserinfo.inactive,tuserinfo.displayname ");
        knsql.append("from tuser, tuserinfo ");
        knsql.append("where tuser.userid = ?userid ");
        knsql.append("and tuser.userid = tuserinfo.userid ");
        knsql.set("userid",context.params.userid);
        let rs = await knsql.executeQuery(db,context);
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
        return this.createDataTable(KnOperation.COLLECT, this.createRecordSet(rs), {}, "sfte005/sfte005_data");
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
                return this.createDataTable(KnOperation.RETRIEVAL, row, dt.entity, "sfte005/sfte005_dialog");
            }
            return this.recordNotFound();
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    /**
     * Override for add new record action (prepare screen for add)
     * @param context 
     * @param model 
     * @returns KnDataTable
     */
    public override async getDataAdd(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let ds = this.emptyDataSet();
        ds.gender = "M";
        ds.userpassword = PasswordLibrary.createNewPassword();
        return this.createDataTable(KnOperation.ADD, ds, {}, "sfte005/sfte005_dialog");
    }

    /**
     * Override in order to create/insert new records
     */
    protected override async doCreating(context: any, model: KnModel): Promise<KnResultSet> {
        let db = this.getPrivateConnector(model);
        try {
            let eng = KnUtility.isEnglish(context);
            let found = false;
            let knsql = new KnSQL();
            knsql.append("select userid,username ");
            knsql.append("from tuser ");
            knsql.append("where userid = ?userid or username = ?username ");
            knsql.set("userid",context.params.username);
            knsql.set("username",context.params.username);
            let rs = await knsql.executeQuery(db,context);
            found = rs.rows.length>0;
            if(found) return Promise.reject(new VerifyError("User is already existed",HTTP.NOT_ACCEPTABLE,-18898));
            found = false;
            knsql.clear();
            knsql.clear();
            knsql.append("select userid ");
            knsql.append("from tuserinfo ");
            knsql.append("where email = ?email ");
            knsql.set("email",context.params.email);
            rs = await knsql.executeQuery(db,context);
            found = rs.rows.length>0;
            if(found) return Promise.reject(new VerifyError("Email is already existed",HTTP.NOT_ACCEPTABLE,-18879));
            found = false;
            /*
            knsql.clear();
            knsql.append("select userid ");
            knsql.append("from tuserinfo ");
            knsql.append("where userid = ?userid ");
            knsql.set("userid",context.params.username);
            rs = await knsql.executeQuery(db,context);
            found = rs.rows.length>0;
            */
            rs = await this.insertUserTable(context, model, db, found);
            let record = rs.rows[0];
            let [msg,tmp] = await this.composeMailMessage(db, record, eng);
            this.mailing(context, {email: record.email, subject: tmp?tmp.subjecttitle:"Confirm New Account", message: msg});
            return rs;
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    public async composeMailMessage(db: KnDBConnector, record: any, eng: boolean = true, template: string = "USER_INFO", templatetype: string = "MAIL_NOTIFY") : Promise<[string,KnTemplateInfo|undefined]> {
        let msg = undefined;
        let noti = new KnNotifyConfig();
        let tmp = await noti.getConfigTemplate(db, template, templatetype);
        if(tmp) {
            msg = eng?tmp.contents:tmp.contexts;
        }
        if(!msg || msg.trim().length==0) {
            msg = "Dear, ${userfullname}.<br/>";
            msg += "New account was created for access system.<br/>";
            msg += "To confirm, please kindly use information below.<br/><br/>";
            msg += "user = ${username}<br/>"
            msg += "password = ${userpassword}<br/>";
            msg += "<br/>Yours sincerely,<br/>";
            msg += "Administrator<br/>";
        }
        return [Utilities.translateVariables(msg, record),tmp];	
    }

    public async insertUserTable(context: KnContextInfo, model: KnModel, db: KnDBConnector, found: boolean) : Promise<KnRecordSet> {
        let result = this.createRecordSet();
        let site = context.params.site;
        if(!site || site.trim()=="") site = this.userToken?.site;
        let curdate = Utilities.now();
        context.params.userid = uuid();
        let plib = new PasswordLibrary();
        let passwordexpiredate = await plib.getUserExpireDate(db, context.params.userid, curdate);
        let userpassword = context.params.userpassword;
        if(!userpassword || userpassword.trim()=="") {
            userpassword = "password";
        }
        let record = { userfullname: context.params.usertname+" "+context.params.usertsurname, 
            username: context.params.username, userpassword: userpassword, passwordexpiredate: passwordexpiredate,
            email: context.params.email, mobile: context.params.mobile, lineid: context.params.lineid
        };
        userpassword = plib.encrypt(userpassword);  
        let knsql = new KnSQL();
        await db.beginWork();
        try {
            if(!found) {
                knsql.clear();
                knsql.append("insert into tuserinfo(site,employeeid,userid,userename,useresurname,usertname,usertsurname,email,gender,mobile,lineid,inactive,editdate,edittime,edituser) ");
                knsql.append("values(?site,?employeeid,?userid,?userename,?useresurname,?usertname,?usertsurname,?email,?gender,?mobile,?lineid,?inactive,?editdate,?edittime,?edituser) ");
                knsql.set("site",site);
                knsql.set("employeeid",context.params.username);
                knsql.set("userid",context.params.userid);
                knsql.set("usertname",context.params.usertname);
                knsql.set("usertsurname",context.params.usertsurname);
                knsql.set("userename",context.params.userename);
                knsql.set("useresurname",context.params.useresurname);
                knsql.set("email",context.params.email);
                knsql.set("gender",context.params.gender);
                knsql.set("mobile",context.params.mobile);
                knsql.set("lineid",context.params.lineid);
                knsql.set("inactive",context.params.inactive);
                knsql.set("editdate",curdate,"DATE");
                knsql.set("edittime",curdate,"TIME");
                knsql.set("edituser",this.userToken?.userid);    
                await knsql.executeUpdate(db,context);
            } else {
                knsql.clear();
                knsql.append("update tuserinfo set userename=?userename, useresurname=?useresurname, ");
                knsql.append("usertname=?usertname, usertsurname=?usertsurname, ");
                knsql.append("email=?email, gender=?gender, mobile=?mobile, lineid=?lineid, inactive='0', ");
                knsql.append("editdate=?editdate, edittime=?edittime, edituser=?edituser ");
                knsql.append("where userid=?userid ");
                knsql.set("userid",context.params.userid);
                knsql.set("usertname",context.params.usertname);
                knsql.set("usertsurname",context.params.usertsurname);
                knsql.set("userename",context.params.userename);
                knsql.set("useresurname",context.params.useresurname);
                knsql.set("email",context.params.email);
                knsql.set("gender",context.params.gender);
                knsql.set("mobile",context.params.mobile);
                knsql.set("lineid",context.params.lineid);
                knsql.set("editdate",curdate,"DATE");
                knsql.set("edittime",curdate,"TIME");
                knsql.set("edituser",this.userToken?.userid);
                await knsql.executeUpdate(db,context);								
            }
            await this.updateUserPrivileges(context, model, db);
            knsql.clear();
            knsql.append("insert into tuser(userid,username,site,startdate,status,userpassword,passwordexpiredate,changeflag,editdate,edittime,edituser) ");
            knsql.append("values(?userid,?username,?site,?startdate,'A',?userpassword,?passwordexpiredate,'1',?editdate,?edittime,?edituser) ");
            knsql.set("userid",context.params.userid);
            knsql.set("username",context.params.username);
            knsql.set("site",site);
            knsql.set("startdate",curdate,"DATE");
            knsql.set("userpassword",userpassword);
            knsql.set("passwordexpiredate",passwordexpiredate);
            knsql.set("editdate",curdate,"DATE");
            knsql.set("edittime",curdate,"TIME");
            knsql.set("edituser",this.userToken?.userid);
            let rs = await knsql.executeUpdate(db,context);
            result = this.createRecordSet(rs);
            result.rows = [record];
            await db.commitWork();            
            return result;
        } catch(ex: any) {
            db.rollbackWork();
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(ex);
        }
    }

    public async updateUserPrivileges(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnRecordSet> {
        let result = this.createRecordSet();
        if(DEFAULT_PRIVILEGES && DEFAULT_PRIVILEGES.trim()!="") {
            let knsql = new KnSQL();
            knsql.append("select * from tusergrp ");
            knsql.append("where userid=?userid and groupname=?groupname ");
            let inssql = new KnSQL();
            inssql.append("insert into tusergrp (userid,groupname) values(?userid,?groupname) ");
            let privileges = DEFAULT_PRIVILEGES.split(",");
            for(let groupname of privileges) {
                if(groupname && groupname.trim()!="") {
                    let found = false;
                    knsql.clearParameter();
                    knsql.set("userid",context.params.userid);
                    knsql.set("groupname",groupname);
                    let rs = await knsql.executeQuery(db,context);
                    found = rs.rows.length>0;
                    if(!found) {
                        inssql.clearParameter();
                        inssql.set("userid",context.params.userid);
                        inssql.set("groupname",groupname);
                        rs = await inssql.executeUpdate(db,context);
                        if(rs.rows.affectedRows) {
                            result.records += rs.rows.affectedRows;
                        }
                    }
                }
            }
        }
        return result;
    }
    
    /**
     * Override in order to update records
     */
    protected override async doUpdating(context: any, model: KnModel): Promise<KnResultSet> {
        let result = this.createRecordSet();
		let db = this.getPrivateConnector(model);
		try {
            let status = undefined;
            if("1"==context.params.inactive) {
                status = "C";
            } else {                
                let knsql = new KnSQL();
                knsql.append("select status ");
                knsql.append("from tuser ");
                knsql.append("where userid = ?userid ");
                knsql.set("userid",context.params.userid);
                let rs = await knsql.executeQuery(db,context);
                if(rs && rs.rows.length>0) {
                    let row = rs.rows[0];
                    status = "C"==row.status?"A":row.status;
                }
            }
            result = await this.updateUserTable(context, model, db, status);
		} catch(ex: any) {
			this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
		}
        return result;
    }

    public async updateUserTable(context: KnContextInfo, model: KnModel, db: KnDBConnector, status: string) : Promise<KnRecordSet> {  
        let result = this.createRecordSet();
        await db.beginWork();
        try {
            let curdate = Utilities.now();
            let knsql = new KnSQL();
            knsql.append("update tuserinfo set usertname=?usertname, usertsurname=?usertsurname, ");
            knsql.append("userename=?userename, useresurname=?useresurname, email=?email, ");
            knsql.append("gender=?gender, mobile=?mobile, lineid=?lineid, inactive=?inactive, ");
            knsql.append("editdate=?editdate, edittime=?edittime, edituser=?edituser ");
            knsql.append("where userid=?userid ");
            knsql.set("userid",context.params.userid);
            knsql.set("usertname",context.params.usertname);
            knsql.set("usertsurname",context.params.usertsurname);
            knsql.set("userename",context.params.userename);
            knsql.set("useresurname",context.params.useresurname);
            knsql.set("email",context.params.email);
            knsql.set("gender",context.params.gender);
            knsql.set("mobile",context.params.mobile);
            knsql.set("lineid",context.params.lineid);
            knsql.set("inactive",context.params.inactive);
            knsql.set("editdate",curdate,"DATE");
            knsql.set("edittime",curdate,"TIME");
            knsql.set("edituser",this.userToken?.userid);
            let rs = await knsql.executeUpdate(db,context);
            if(status !== undefined) {
                knsql.clear();
                knsql.append("update tuser set status=?status, ");
                knsql.append("editdate=?editdate, edittime=?edittime, edituser=?edituser ");
                knsql.append("where userid=?userid ");
                knsql.set("userid",context.params.userid);
                knsql.set("status",status);
                knsql.set("editdate",curdate,"DATE");
                knsql.set("edittime",curdate,"TIME");
                knsql.set("edituser",this.userToken?.userid);
                rs = await knsql.executeUpdate(db,context);
            }
            result = this.createRecordSet(rs);
            await db.commitWork(); 
            return result;                   
        } catch(ex: any) {
            db.rollbackWork();
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(ex);
        }
    }
    
    /**
     * Override in order to delete all involved records
     */
    protected override async doClearing(context: any, model: KnModel): Promise<KnRecordSet> {
        let result = this.createRecordSet();
		let db = this.getPrivateConnector(model);
		try {
            result = await this.deleteUserTable(context, model, db);
		} catch(ex: any) {
			this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
        return result;
    }  
    
    public async deleteUserTable(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnRecordSet> {  
        let result = this.createRecordSet();
        await db.beginWork();
        try {
            let knsql = new KnSQL();
            knsql.append("insert into tuserinfohistory ");
            knsql.append("select * from tuserinfo where userid = ?userid ");
            knsql.set("userid",context.params.userid);
            await knsql.executeUpdate(db,context);
            knsql.clear();
            knsql.append("delete from tuserinfo where userid = ?userid ");
            knsql.set("userid",context.params.userid);
            await knsql.executeUpdate(db,context);
            knsql.clear();	
            knsql.append("delete from tusergrp where userid = ?userid ");
            knsql.set("userid",context.params.userid);
            await knsql.executeUpdate(db,context);
            knsql.clear();
            knsql.append("delete from tfavor where userid = ?userid ");
            knsql.set("userid",context.params.userid);
            await knsql.executeUpdate(db,context);
            knsql.clear();
            knsql.append("delete from tuser where userid = ?userid ");
            knsql.set("userid",context.params.userid);
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
