import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnSQLInterface, KnRecordSet, KnSQL } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { Utilities } from "@willsofts/will-util";
import { TknOperateHandler } from '../handlers/TknOperateHandler';
import { KnValidateInfo, KnContextInfo, KnDataEntity, KnDataTable } from '../models/KnCoreAlias';
import { VerifyError } from '../models/VerifyError';
import { OPERATE_HANDLERS } from "../models/KnServAlias";

export class Sfte002Handler extends TknOperateHandler {

    public progid = "sfte002";
    public model : KnModel = { 
        name: "tgroup", 
        alias: { privateAlias: this.section }, 
        fields: {
            groupname: { type: "STRING", key: true },
            supergroup: { type: "STRING" },
            nameen: { type: "STRING" },
            nameth: { type: "STRING" },
            seqno: { type: "INTEGER" },
            iconstyle: { type: "STRING" },
            privateflag: { type: "STRING" },
            usertype: { type: "STRING" },
            mobilegroup: { type: "STRING" },
            editdate: { type: "DATE", selected: false, created: true, updated: true, defaultValue: null },
            edittime: { type: "TIME", selected: false, created: true, updated: true, defaultValue: null },
            edituser: { type: "STRING", selected: false, created: true, updated: true, defaultValue: null }
        },
    };
    public handlers = OPERATE_HANDLERS.concat([ 
        {name: "permit"}, {name: "proglist"}, {name: "proginsert"}, {name: "progupdate"}, {name: "progremove"} 
    ]);

    public async permit(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: "permit", raw: true}, this.doPermit);
    }

    public async proglist(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: "proglist", raw: false}, this.doProgList);
    }

    public async proginsert(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: "proginsert", raw: false}, this.doProgInsert);
    }

    public async progupdate(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: "progupdate", raw: false}, this.doProgUpdate);
    }

    public async progremove(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: "progremove", raw: false}, this.doProgRemove);
    }

    /* try to assign individual parameters under this context */
    protected override async assignParameters(context: KnContextInfo, sql: KnSQLInterface, action?: string, mode?: string) {
        sql.set("privateflag",context.params.privateflag && context.params.privateflag!=""?context.params.privateflag:"0");
        sql.set("editdate",Utilities.now(),"DATE");
        sql.set("edittime",Utilities.now(),"TIME");
        sql.set("edituser",this.userToken?.userid);
    }

    /* try to validate fields for insert, update, delete, retrieve */
    protected override validateRequireFields(context: KnContextInfo, model: KnModel, action: string) : Promise<KnValidateInfo> {
        let vi = this.validateParameters(context.params,"groupname");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        return Promise.resolve(vi);
    }

    protected override buildFilterQuery(context: KnContextInfo, model: KnModel, knsql: KnSQLInterface, selector: string, action?: string, subaction?: string): KnSQLInterface {
        if(this.isCollectMode(action)) {
            let params = context.params;
            knsql.append(selector);
            knsql.append(" from ");
            knsql.append(model.name);
            let filter = " where ";
            if(params.groupname && params.groupname!="") {
                knsql.append(filter).append("groupname LIKE ?groupname");
                knsql.set("groupname","%"+params.groupname+"%");
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
        let settings = this.getCategorySetting(context, "tprog", "tkgroupmobile", "tkusertype", "tkpermit");
        return await this.getDataCategories(context, db, settings);
    }

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        try {
            let dt = await this.doCategories(context, model);
            dt.action = KnOperation.EXECUTE;
            dt.dataset = this.emptyDataSet();
            return dt;
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        }
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
        let knsql = new KnSQL();
        knsql.append("select * from tgroup where groupname = ?groupname ");
        knsql.set("groupname",context.params.groupname);
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
        return this.createDataTable(KnOperation.COLLECT, this.createRecordSet(rs), {}, "sfte002/sfte002_data");
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
            let rs = await this.performRetrieving(context, model, db);
            if(rs.rows.length>0) {
                let row = this.transformData(rs.rows[0]);
                let dt = await this.performCategories(context, model, db);
                return this.createDataTable(KnOperation.RETRIEVAL, row, dt.entity, "sfte002/sfte002_insert_dialog");
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
        let dt = await this.doCategories(context, model);
        dt.action = KnOperation.ADD;
        dt.renderer = "sfte002/sfte002_insert_dialog";
        return dt;
    }

    protected async doPermit(context: KnContextInfo, model: KnModel): Promise<string> {
        let rs = await this.doPermitting(context, model);
        return await this.createCipherData(context, "permit", rs);
    }

    protected async doPermitting(context: KnContextInfo, model: KnModel): Promise<string> {
        let ds = await this.getDataPermit(context, model);
        return this.buildHtml("/views/"+ds.renderer, ds, context);
    }   

    public async getDataPermit(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let vi = this.validateParameters(context.params,"groupid","progid");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        let db = this.getPrivateConnector(model);
        try {
            let settings = this.getCategorySetting(context, "tkpermit");
            let dt = await this.getDataCategories(context, db, settings);
            let permmap = await this.getProgPermit(context, model, db);
            if(permmap.size==0) {
                let entity = dt.entity as KnDataEntity;
                let tkpermit = entity.tkpermit;
                for(let p in tkpermit) {
                    permmap.set(p, "true");
                }
            }
            dt.dataset.groupname = context.params.groupid;
            dt.dataset.programid = context.params.progid;
            dt.dataset.permits = Object.fromEntries(permmap);
            dt.renderer = "sfte002/sfte002_permit_dialog";
            return dt;
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    public async getProgPermit(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<Map<string,string>> {
        let permmap = new Map<string,string>();
        let knsql = new KnSQL();
        knsql.append("select * from tpperm ");
        knsql.append("where groupid = ?groupid ");
        knsql.append("and progid = ?progid ");
        knsql.set("groupid",context.params.groupid);
        knsql.set("progid",context.params.progid);
        let rs = await knsql.executeQuery(db,context);
        if(rs.rows.length>0) {
            for(let r of rs.rows) {
                permmap.set(r.permname, r.permvalue);
            }
        }
        return permmap;
    }

    protected async doProgList(context: KnContextInfo, model: KnModel): Promise<KnRecordSet> {
        await this.validateRequireFields(context, model, KnOperation.RETRIEVE);
        let rs = await this.getDataProgList(context, model);
        return await this.createCipherData(context, KnOperation.RETRIEVE, rs);
    }

    public async getDataProgList(context: KnContextInfo, model: KnModel, action: string = KnOperation.RETRIEVE): Promise<KnRecordSet> {
        let db = this.getPrivateConnector(model);
        try {
            let knsql = new KnSQL();
            knsql.append("select tproggrp.seqno,tproggrp.programid,tprog.progname,tproggrp.parameters ");
            knsql.append("from tproggrp,tprog ");
            knsql.append("where tproggrp.groupname = ?groupname ");
            knsql.append("and tproggrp.programid = tprog.programid ");
            knsql.append("order by seqno,programid ");
            knsql.set("groupname",context.params.groupname);
            let rs = await knsql.executeQuery(db,context);
            return this.createRecordSet(rs);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    public async getProgGroup(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("select * from tproggrp ");
        knsql.append("where groupname = ?groupname ");
        knsql.append("and programid = ?programid ");
        knsql.set("groupname",context.params.groupname);
        knsql.set("programid",context.params.programid);
        let rs = await knsql.executeQuery(db,context);
        return this.createRecordSet(rs);    
    }

    public async insertProgGroup(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("insert into tproggrp (groupname,programid,parameters,seqno) ");
        knsql.append("values(?groupname,?programid,?parameters,?seqno)");
        knsql.set("groupname",context.params.groupname);
        knsql.set("programid",context.params.programid);
        knsql.set("parameters",context.params.parameters);
        knsql.set("seqno",context.params.seqno,"INTEGER");
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);    
    }

    public async updateProgGroup(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("update tproggrp set parameters = ?parameters, seqno = ?seqno ");
        knsql.append("where groupname = ?groupname ");
        knsql.append("and programid = ?programid ");
        knsql.set("groupname",context.params.groupname);
        knsql.set("programid",context.params.programid);
        knsql.set("parameters",context.params.parameters);
        knsql.set("seqno",context.params.seqno,"INTEGER");
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);    
    }

    public async deleteProgGroup(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("delete from tproggrp ");
        knsql.append("where groupname = ?groupname ");
        knsql.append("and programid = ?programid ");
        knsql.set("groupname",context.params.groupname);
        knsql.set("programid",context.params.programid);
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);    
    }

    public async deleteProgFavor(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("delete from tfavor ");
        knsql.append("where programid = ?programid ");
        knsql.set("programid",context.params.programid);
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);
    }

    public async insertPermits(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnRecordSet> {
        let permnames = context.params.permname;        
        let permvalues = context.params.permvalue;
        if(Utilities.isString(permnames)) {
            permnames = [permnames];
        }
        if(Utilities.isString(permvalues)) {
            permvalues = [permvalues];
        }
        let result = this.createRecordSet();
        let knsql = new KnSQL();
        knsql.append("insert into tpperm (groupid,progid,permname,permvalue) ");
        knsql.append("values(?groupid,?progid,?permname,?permvalue)");
        if(permnames && permvalues && permnames.length==permvalues.length) {
            for(let i=0;i<permnames.length;i++) {
                knsql.set("groupid",context.params.groupname);
                knsql.set("progid",context.params.programid);
                knsql.set("permname",permnames[i]);
                knsql.set("permvalue",permvalues[i]);
                let rs = await knsql.executeUpdate(db,context);
                result.records += rs.rows.affectedRows?rs.rows.affectedRows:0;
            }    
        }
        return result;
    }

    public async deletePermits(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("delete from tpperm ");
        knsql.append("where groupid = ?groupid ");
        knsql.append("and progid = ?progid ");
        knsql.set("groupid",context.params.groupname);
        knsql.set("progid",context.params.programid);
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);
    }

    public async deletePermitsGroup(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("delete from tpperm ");
        knsql.append("where groupid = ?groupid ");
        knsql.set("groupid",context.params.groupname);
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);
    }

    protected async doProgInsert(context: KnContextInfo, model: KnModel): Promise<KnRecordSet> {
        let rs = await this.doProgInserting(context, model);
        return await this.createCipherData(context, KnOperation.INSERT, rs);
    }

    public async doProgInserting(context: KnContextInfo, model: KnModel): Promise<KnRecordSet> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.getProgGroup(context, model, db);
            if(rs.rows.length>0) {
                return rs;
            } else {
                await db.beginWork();
                await this.deletePermits(context, model, db);
                await this.insertPermits(context, model, db);
                rs = await this.insertProgGroup(context, model, db);
                await db.commitWork();
            }
            return rs;
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            await db.rollbackWork();
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }   

    protected async doProgUpdate(context: KnContextInfo, model: KnModel): Promise<KnRecordSet> {
        let rs = await this.doProgUpdating(context, model);
        return await this.createCipherData(context, KnOperation.UPDATE, rs);
    }

    protected async doProgUpdating(context: KnContextInfo, model: KnModel): Promise<KnRecordSet> {
        let db = this.getPrivateConnector(model);
        try {
            await db.beginWork();
            await this.deletePermits(context, model, db);
            await this.insertPermits(context, model, db);
            let rs = await this.updateProgGroup(context, model, db);
            await db.commitWork();
            return rs;
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            await db.rollbackWork();
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }   

    protected async doProgRemove(context: KnContextInfo, model: KnModel): Promise<KnRecordSet> {
        let rs = await this.doProgRemoving(context, model);
        return await this.createCipherData(context, KnOperation.REMOVE, rs);
    }

    protected async doProgRemoving(context: KnContextInfo, model: KnModel): Promise<KnRecordSet> {
        let db = this.getPrivateConnector(model);
        try {
            await db.beginWork();
            await this.deletePermits(context, model, db);
            await this.deleteProgFavor(context, model, db);
            let rs = await this.deleteProgGroup(context, model, db);
            await db.commitWork();
            return rs;
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            await db.rollbackWork();
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }   

    public async updateProgramSequence(context: KnContextInfo, model: KnModel, db: KnDBConnector) : Promise<KnRecordSet> {
        let progid = context.params.progid;
        let result = this.createRecordSet();
        let knsql = new KnSQL();
        knsql.append("update tproggrp set seqno = ?seqno ");
		knsql.append("where groupname = ?groupname and programid = ?programid ");
        if(progid && progid.length) {
            for(let i=0;i<progid.length;i++) {
                knsql.set("seqno",i+1);
                knsql.set("groupname",context.params.groupname);
                knsql.set("programid",progid[i]);
                let rs = await knsql.executeUpdate(db,context);
                result.records += rs.rows.affectedRows?rs.rows.affectedRows:0;
            }    
        }
        return result;
    }

    protected override async doUpdating(context: KnContextInfo, model: KnModel): Promise<KnRecordSet> {
        let db = this.getPrivateConnector(model);
        try {
            await db.beginWork();
            await this.updateProgramSequence(context, model, db);
            let rs = await this.performUpdating(context, model, db);
            await db.commitWork();
            return this.createRecordSet(rs);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            await db.rollbackWork();
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

}
