import { v4 as uuid } from 'uuid';
import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnSQL, KnRecordSet, KnDBConnector, KnSQLInterface, KnResultSet } from '@willsofts/will-sql';
import { HTTP } from "@willsofts/will-api";
import { Utilities } from "@willsofts/will-util";
import { VerifyError } from "../models/VerifyError";
import { KnContextInfo, KnValidateInfo, KnActivateInfo } from '../models/KnCoreAlias';
import { TknSchemeHandler } from "./TknSchemeHandler";
import { DEFAULT_INVALIDATE_TIMES } from "../utils/EnvironmentVariable";

export class TknActivateHandler extends TknSchemeHandler {
    public model : KnModel = { 
        name: "tactivate", 
        alias: { privateAlias: this.section },
        fields: {
            activatekey: { type: "STRING", key: true },
            activateuser: { type: "STRING", created: true },
            transtime: { type: "BIGINT", created: true },
            senddate: { type: "DATE", created: true },
            sendtime: { type: "TIME", created: true },
            expiredate: { type: "DATE" },
            activatedate: { type: "DATE" },
            activatetime: { type: "TIME" },
            activatestatus: { type: "STRING" },
            activatecount: { type: "INTEGER" },
            activatetimes: { type: "INTEGER" },
            activatecategory: { type: "STRING" },
            activatelink: { type: "STRING" },
            activatepage: { type: "STRING" },
            activateremark: { type: "STRING" },
            activateparameter: { type: "STRING" },
            activatemessage: { type: "STRING" },
            activatecontents: { type: "STRING" },
        },
    };
    
    public activateInfo: KnActivateInfo | undefined;
    public activateCategory: string = "ACTIVATE";
    public handlers = [ {name: "invalidate"}, {name: "activate"}, {name: "inactivate"}, {name: "removal"} ];

    public async invalidate(context: KnContextInfo) : Promise<KnRecordSet> {
        return this.callFunctional(context, {operate: "invalidate", raw: false}, this.doInvalidate);
    }

    public async activate(context: KnContextInfo) : Promise<KnRecordSet> {
        return this.callFunctional(context, {operate: "activate", raw: false}, this.doActivate);
    }

    public async inactivate(context: KnContextInfo) : Promise<KnRecordSet> {
        return this.callFunctional(context, {operate: "inactivate", raw: false}, this.doInactivate);
    }

    public async removal(context: KnContextInfo) : Promise<KnRecordSet> {
        return this.callFunctional(context, {operate: "removal", raw: false}, this.doRemoval);
    }

    public createActivateKey() : string {
        return uuid();
    }

    public createActivateInfo(data?: any, invalidatetimes: number = DEFAULT_INVALIDATE_TIMES) : KnActivateInfo {
        let keyid = this.createActivateKey();
        let transtime = data?.transtime || Utilities.now().getTime();
        this.activateInfo = {
            activatekey: data?.activatekey || keyid,
            activateuser: data?.activateuser || keyid,
            transtime: transtime,
            expiretime: transtime + invalidatetimes,
            activatecount: data?.activatecount || 0,
            activatetimes: data?.activatetimes || 3,
            expiredate: data?.expiredate,
            activatecategory: data?.activatecategory || this.activateCategory,
            activatestatus: data?.activatestatus,
            activatelink: data?.activatelink,
            activatepage: data?.activatepage,
            activateremark: data?.activateremark,
            activateparameter: data?.activateparameter,
            activatemessage: data?.activatemessage,
            activatecontents: data?.activatecontents
        };
        return this.activateInfo;
    }

    protected override assignParameters(context: KnContextInfo, sql: KnSQLInterface, action?: string, mode?: string) {
        if(KnOperation.CREATE==action) {
            sql.set("senddate",Utilities.now(),"DATE");
            sql.set("sendtime",Utilities.now(),"TIME");
            sql.set("transtime",Utilities.now().getTime());
            sql.set("activatestatus",null);
        }
    }

    protected validateActivateInfo(info: KnActivateInfo) : KnValidateInfo {
        let valid : KnValidateInfo = {valid: true};
        if(!info.activatekey || info.activatekey.trim().length==0) {
            valid = {valid: false, info: "activatekey"};
        }
        if(!info.activateuser || info.activateuser.trim().length==0) {
            valid = {valid: false, info: "activateuser"};
        }
        return valid;
    }

    public override async doCreate(context: KnContextInfo, model: KnModel, invalidatetimes: number = DEFAULT_INVALIDATE_TIMES) : Promise<KnActivateInfo> {
        let activateuser = undefined;
        let info = this.activateInfo;
        if(!info) {
            let userInfo = await this.getUserTokenInfo(context, true);
            activateuser = userInfo?.useruuid || context.params.activateuser;
        }
        if(!info) {
            info = this.createActivateInfo(context.params,invalidatetimes);
            info.activateuser = activateuser;
        }
        let vi = this.validateActivateInfo(info);
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        let db = this.getPrivateConnector(model);
        try {
            await this.createActivation(db, info, context);
            return await this.createCipherData(context, KnOperation.CREATE, info);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    public async createActivation(db: KnDBConnector, info: KnActivateInfo, context?: any): Promise<KnResultSet> {
        let now = Utilities.now();
        let knsql = new KnSQL();
        knsql.append("insert into tactivate (activatekey, activateuser, transtime, expiretime, ");
        knsql.append("senddate, sendtime, expiredate, activatecount, activatetimes, ");
        knsql.append("activatecategory, activatelink, activatepage, activateremark, ");
        knsql.append("activateparameter, activatemessage, activatecontents) ");
        knsql.append("values (?activatekey,?activateuser,?transtime,?expiretime,");
        knsql.append("?senddate,?sendtime,?expiredate,?activatecount,?activatetimes,");
        knsql.append("?activatecategory,?activatelink,?activatepage,?activateremark,");
        knsql.append("?activateparameter,?activatemessage,?activatecontents) ");
        knsql.set("activatekey", info.activatekey);
        knsql.set("activateuser", info.activateuser);
        knsql.set("transtime", info.transtime);
        knsql.set("expiretime", info.expiretime);
        knsql.set("senddate", now, "DATE");
        knsql.set("sendtime", now, "TIME");
        knsql.set("expiredate", info.expiredate, "DATE");
        knsql.set("activatecount", info.activatecount);
        knsql.set("activatetimes", info.activatetimes);
        knsql.set("activatecategory", info.activatecategory);
        knsql.set("activatelink", info.activatelink);
        knsql.set("activatepage", info.activatepage);
        knsql.set("activateremark", info.activateremark);
        knsql.set("activateparameter", info.activateparameter);
        knsql.set("activatemessage", info.activatemessage);
        knsql.set("activatecontents", info.activatecontents);
        return await knsql.executeUpdate(db,context);
    }

    public validateKeyFields(context: KnContextInfo) : KnValidateInfo {
        let vi = this.validateParameters(context.params,"id");
        if(!vi.valid) {
            vi = this.validateParameters(context.params,"activatekey");
        }
        return vi;
    }

    protected override async doRetrieve(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        let vi = this.validateKeyFields(context);
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.doRetrieving(context, db);
            return await this.createCipherData(context, KnOperation.RETRIEVE, rs);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    public async doRetrieving(context: KnContextInfo, db: KnDBConnector) : Promise<KnRecordSet> {
        let activatekey = context.params.id || context.params.activatekey;
        let info = this.createActivateInfo(context.params);
        info.activatekey = activatekey;
        return await this.performRetrieving(db, info, context);
    }

    public async performRetrieving(db: KnDBConnector, info: KnActivateInfo, context?: any): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("select * from tactivate ");
        knsql.append("where activatekey = ?activatekey ");
        knsql.append("and activateuser = ?activateuser ");
        knsql.append("and activatestatus is null ");
        knsql.set("activatekey", info.activatekey);
        knsql.set("activateuser", info.activateuser);
        let rs = await knsql.executeQuery(db,context);
        let result = this.createRecordSet(rs);
        if(result.records<=0) {
            knsql.clear();
            knsql.append("select * from tactivate ");
            knsql.append("where activatekey = ?activatekey ");
            knsql.append("and activatestatus is null ");
            knsql.set("activatekey", info.activatekey);
            rs = await knsql.executeQuery(db,context);
            result = this.createRecordSet(rs);
        }
        return result;
    }

    public async getActivateInfo(db: KnDBConnector, info: KnActivateInfo, context?: any): Promise<KnActivateInfo | undefined> {
        let rs = await this.performRetrieving(db, info, context);
        if(rs && rs.rows.length>0) {
            return rs.rows[0];
        }
        return undefined;
    }

    public async doActivate(context: KnContextInfo, model: KnModel) : Promise<KnActivateInfo> {
        let vi = this.validateKeyFields(context);
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        let db = this.getPrivateConnector(model);
        try {
            let ainfo = await this.doActivating(context, db);
            return await this.createCipherData(context, "activate", ainfo);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    public async doActivating(context: KnContextInfo, db: KnDBConnector) : Promise<KnActivateInfo> {
        let activatekey = context.params.id || context.params.activatekey;
        let info = this.createActivateInfo(context.params);
        info.activatekey = activatekey;
        let ainfo = await this.getActivateInfo(db, info, context);
        if(ainfo) {
            await this.performActivating(db, ainfo, context);
            return ainfo;
        }
        return this.recordNotFound();
    }
    
    public async performActivating(db: KnDBConnector, info: KnActivateInfo, context?: any): Promise<KnRecordSet> {
        let rs = await this.updateActivation(db, info, context);
        await this.deleteActivation(db, info, context);                
        return rs;
}

    public async updateActivation(db: KnDBConnector, info: KnActivateInfo, context?: any): Promise<KnRecordSet> {
        let result = await this.updateActivateByKeyAndUser(db, info, context);
        if(result.records<=0) {
            result = await this.updateActivateByKey(db, info, context);    
        }
        return result;
    }

    public async updateActivateByKeyAndUser(db: KnDBConnector, info: KnActivateInfo, context?: any): Promise<KnRecordSet> {
        let now = Utilities.now();
        info.activatedate = now;
        info.activatetime = now;
        info.activatecount = info.activatecount || 1;
        info.activatestatus = info.activatestatus || "A";
        let knsql = new KnSQL();
        knsql.append("update tactivate ");
        knsql.append("set activatestatus=?activatestatus, ");
        knsql.append("activatedate=?activatedate, ");
        knsql.append("activatetime=?activatetime, ");
        knsql.append("activatecount=?activatecount ");
        knsql.append("where activatekey=?activatekey ");
        knsql.append("and activateuser=?activateuser ");
        knsql.set("activatestatus", info.activatestatus);
        knsql.set("activatedate", info.activatedate, "DATE");
        knsql.set("activatetime", info.activatetime, "TIME");
        knsql.set("activatecount", info.activatecount);
        knsql.set("activatekey", info.activatekey);
        knsql.set("activateuser", info.activateuser);
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);
    }

    public async updateActivateByKey(db: KnDBConnector, info: KnActivateInfo, context?: any): Promise<KnRecordSet> {
        let now = Utilities.now();
        info.activatedate = now;
        info.activatetime = now;
        info.activatecount = info.activatecount || 1;
        info.activatestatus = info.activatestatus || "A";
        let knsql = new KnSQL();
        knsql.append("update tactivate ");
        knsql.append("set activatestatus=?activatestatus, ");
        knsql.append("activatedate=?activatedate, ");
        knsql.append("activatetime=?activatetime, ");
        knsql.append("activatecount=?activatecount ");
        knsql.append("where activatekey=?activatekey ");
        knsql.set("activatestatus", info.activatestatus);
        knsql.set("activatedate", info.activatedate, "DATE");
        knsql.set("activatetime", info.activatetime, "TIME");
        knsql.set("activatecount", info.activatecount);
        knsql.set("activatekey", info.activatekey);
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);    
    }

    public async deleteActivateUser(db: KnDBConnector, info: KnActivateInfo, context?: any): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("delete from tactivate ");
        knsql.append("where activateuser = ?activateuser ");
        knsql.set("activateuser", info.activateuser);
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);
    }

    public async deleteActivateUserCategory(db: KnDBConnector, info: KnActivateInfo, context?: any): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("delete from tactivate ");
        knsql.append("where activateuser = ?activateuser ");
        knsql.append("and activatecategory = ?activatecategory ");
        knsql.set("activateuser", info.activateuser);
        knsql.set("activatecategory", info.activatecategory);
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);
    }

    public async deleteActivateUserKey(db: KnDBConnector, info: KnActivateInfo, context?: any): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("delete from tactivate ");
        knsql.append("where activatekey = ?activatekey ");
        knsql.append("and activateuser = ?activateuser ");
        knsql.set("activatekey", info.activatekey);
        knsql.set("activateuser", info.activateuser);
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);
    }

    public async deleteActivateKey(db: KnDBConnector, info: KnActivateInfo, context?: any): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("delete from tactivate ");
        knsql.append("where activatekey = ?activatekey ");
        knsql.set("activatekey", info.activatekey);
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);
    }

    public async deleteExpiration(db: KnDBConnector, curtime: number = Utilities.now().getTime(), context?: any): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("insert into tactivatehistory ");
        knsql.append("select * from tactivate  ");
        knsql.append("where expiretime < ?curtime ");
        knsql.set("curtime",curtime);
        await knsql.executeUpdate(db,context);
        knsql.clear();
        knsql.append("delete from tactivate  ");
        knsql.append("where expiretime < ?curtime ");
        knsql.set("curtime",curtime);
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);
    }

    public async moveToHistoryByUser(db: KnDBConnector, info: KnActivateInfo, context?: any): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("insert into tactivatehistory ");
        knsql.append("select * from tactivate  ");
        knsql.append("where activateuser = ?activateuser ");
        knsql.set("activateuser", info.activateuser);
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);
    }

    public async moveToHistoryByKey(db: KnDBConnector, info: KnActivateInfo, context?: any): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("insert into tactivatehistory ");
        knsql.append("select * from tactivate  ");
        knsql.append("where activatekey = ?activatekey ");
        knsql.set("activatekey", info.activatekey);
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);
    }

    public async doInvalidate(context: KnContextInfo, model: KnModel) : Promise<KnActivateInfo> {
        let vi = this.validateKeyFields(context);
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        let db = this.getPrivateConnector(model);
        try {
            let ainfo = await this.doInvalidating(context, db);
            return await this.createCipherData(context, "invalidate", ainfo);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    public async doInvalidating(context: KnContextInfo, db: KnDBConnector) : Promise<KnActivateInfo> {
        let activatekey = context.params.id || context.params.activatekey;
        let info = this.createActivateInfo(context.params);
        info.activatekey = activatekey;
        let ainfo = await this.performInvalidating(db, info);
        if(ainfo) return ainfo;
        return this.recordNotFound();
    }
    
    public async performInvalidating(db: KnDBConnector, info: KnActivateInfo, invalidatetimes: number = DEFAULT_INVALIDATE_TIMES): Promise<KnActivateInfo | undefined> {
        let ainfo = await this.getActivateInfo(db, info);
        if(ainfo) {
            if(ainfo.expiredate) {
                let comparator = Utilities.compareDate(Utilities.now(), ainfo.expiredate);
                if(comparator>0) {
                    return Promise.reject(new VerifyError("Activate Expired",HTTP.NOT_ALLOWED,-18801,"expiredate"));
                }
            }
            if(ainfo.activatetimes>0 && ((ainfo.activatecount+1) > ainfo.activatetimes)) {
                return Promise.reject(new VerifyError("Over Activate",HTTP.NOT_ALLOWED,-18802,"activatetimes"));
            }
            let difftimes = Utilities.now().getTime() - ainfo.expiretime;
            if(difftimes > 0) {
                return Promise.reject(new VerifyError("Activate Expired",HTTP.NOT_ALLOWED,-18805,"expiretime"));
            }
            if("D"==ainfo.activatestatus) {
                return Promise.reject(new VerifyError("Already removed",HTTP.NOT_ALLOWED,-18806,"activatestatus"));
            }
        } 
        return ainfo;
    }

    public async doInactivate(context: KnContextInfo, model: KnModel) : Promise<KnActivateInfo> {
        let vi = this.validateKeyFields(context);
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        let db = this.getPrivateConnector(model);
        try {
            let ainfo = await this.doInactivating(context, db);
            return await this.createCipherData(context, "inactivate", ainfo);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    public async doInactivating(context: KnContextInfo, db: KnDBConnector) : Promise<KnActivateInfo> {
        let activatekey = context.params.id || context.params.activatekey;
        let info = this.createActivateInfo(context.params);
        info.activatekey = activatekey;
        let ainfo = await this.performInactivating(db, info, DEFAULT_INVALIDATE_TIMES, context);
        if(ainfo) return ainfo;
        return this.recordNotFound();
    }

    /**
     * To invalidate and activate transaction
     */
    public async performInactivating(db: KnDBConnector, info: KnActivateInfo, invalidatetimes: number = DEFAULT_INVALIDATE_TIMES, context?: any): Promise<KnActivateInfo | undefined> {
        let ainfo = await this.performInvalidating(db, info, invalidatetimes);
        if(ainfo) {
            await this.performActivating(db, ainfo, context);
        }
        return ainfo;
    }

    protected override async doUpdate(context: KnContextInfo, model: KnModel) : Promise<any> {
        let vi = this.validateParameters(context.params,"activatekey");        
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        let rs = await super.doUpdating(context, model);
        return await this.createCipherData(context, KnOperation.REMOVE, this.createRecordSet(rs)); 
    }

    protected override async doRemove(context: KnContextInfo, model: KnModel) : Promise<any> {
        let vi = this.validateParameters(context.params,"activatekey");        
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        let db = this.getPrivateConnector(model);
        try {
            let rs = this.doRemoving(context, db);
            return await this.createCipherData(context, KnOperation.REMOVE, rs);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    public async doRemoving(context: KnContextInfo, db: KnDBConnector) : Promise<KnRecordSet> {
        let rs = this.createRecordSet();
        let info = this.createActivateInfo(context.params);
        let ainfo = await this.getActivateInfo(db, info, context);
        if(ainfo) {
            rs = await this.deleteActivation(db, ainfo, context);
        }
        return rs;
    }

    public async deleteActivation(db: KnDBConnector, info: KnActivateInfo, context?: any) : Promise<KnRecordSet> {
        await this.moveToHistoryByUser(db, info, context);
        return this.deleteActivateUser(db, info, context);
    }

    protected async doRemoval(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        let vi = this.validateParameters(context.params,"activateuser");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.doRemovaling(context, db);
            return await this.createCipherData(context, KnOperation.RETRIEVE, rs);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    public async doRemovaling(context: KnContextInfo, db: KnDBConnector) : Promise<KnRecordSet> {
        let activateuser = context.params.activateuser;
        let info = this.createActivateInfo(context.params);
        info.activateuser = activateuser;
        return await this.performRemovaling(db, info, context);
    }

    public async performRemovaling(db: KnDBConnector, info: KnActivateInfo, context?: any): Promise<KnRecordSet> {
        let rs = await this.performRemoval(db, info, context);
        await this.deleteActivation(db, info, context);
        return rs;
    }

    public async performRemoval(db: KnDBConnector, info: KnActivateInfo, context?: any): Promise<KnRecordSet> {
        info.activatestatus = "D";
        let knsql = new KnSQL();
        knsql.append("update tactivate set activatestatus = 'D' ");
        knsql.append("where activateuser = ?activateuser ");
        knsql.append("and activatestatus is null ");
        knsql.set("activateuser", info.activateuser);
        let rs = await knsql.executeUpdate(db, context);
        return this.createRecordSet(rs);
    }

}
