import { v4 as uuid } from 'uuid';
import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnSQLInterface, KnResultSet, KnRecordSet, KnSQL } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { KnValidateInfo, KnContextInfo, KnDataTable } from '../models/KnCoreAlias';
import { VerifyError } from '../models/VerifyError';
import { KnPageUtility } from '../utils/KnPageUtility';
import { KnUtility } from '../utils/KnUtility';
import { Utilities } from "@willsofts/will-util";
import { KeyTool } from '@willsofts/will-lib';
import { TknOperateHandler } from '../handlers/TknOperateHandler';

export class Sfte018Handler extends TknOperateHandler {

    public progid = "sfte018";
    public model : KnModel = { 
        name: "ttenant", 
        alias: { privateAlias: this.section }, 
        fields: {
            tenantid: { type: "STRING", key: true },
            tenantname: { type: "STRING" },
            inactive: { type: "STRING", created: true, defaultValue: "0" },
            applicationid: { type: "STRING", created: true },
            privatekeys: { type: "STRING", created: true },
            publickeys: { type: "STRING", created: true },
            createdate: { type: "DATE", created: true },
            createtime: { type: "TIME", created: true },
            createuser: { type: "STRING", created: true },
            editdate: { type: "DATE", selected: false, created: true, updated: true, defaultValue: null },
            edittime: { type: "TIME", selected: false, created: true, updated: true, defaultValue: null },
            edituser: { type: "STRING", selected: false, created: true, updated: true, defaultValue: null },
            activename: { type: "STRING", calculated: true },
        },
        //prefix naming with table name when select ex. table.column1,table.column2,...
        prefixNaming: true
    };

    /* try to assign individual parameters under this context */
    protected override assignParameters(context: KnContextInfo, sql: KnSQLInterface, action?: string, mode?: string) {
        sql.set("editdate",Utilities.now(),"DATE");
        sql.set("edittime",Utilities.now(),"TIME");
        sql.set("edituser",this.userToken?.userid);
    }

    /* try to validate fields for insert, update, delete, retrieve */
    protected override validateRequireFields(context: KnContextInfo, model: KnModel, action: string) : Promise<KnValidateInfo> {
        let vi : KnValidateInfo = {valid: true};
        let page = new KnPageUtility(this.progid, context);
        if(page.isInsertMode(action)) {
            vi = this.validateParameters(context.params,"tenantname");
        } else {
            vi = this.validateParameters(context.params,"tenantid");
        }
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        return Promise.resolve(vi);
    }

    protected override buildFilterQuery(context: KnContextInfo, model: KnModel, knsql: KnSQLInterface, selector: string, action?: string, subaction?: string): KnSQLInterface {
        if(this.isCollectMode(action)) {
            let params = context.params;
            let counting = KnOperation.COUNT==subaction;
            let eng = KnUtility.isEnglish(context);
            knsql.append(selector);
            if(!counting) {
                if(eng) {
                    knsql.append(", tkactive.nameen as activedesc ");
                } else {
                    knsql.append(", tkactive.nameth as activedesc ");
                }
            }
            knsql.append(" from ");
            knsql.append(model.name);
            if(!counting) {
                knsql.append(" left join tkactive on tkactive.activeid = ttenant.inactive ");    
            }
            let filter = " where ";
            if(params.tenantname && params.tenantname!="") {
                knsql.append(filter).append("tenantname LIKE ?tenantname");
                knsql.set("tenantname","%"+params.tenantname+"%");
                filter = " and ";
            }
            if(params.fromdate && params.fromdate!="") {
                let fromdate = Utilities.parseDate(params.fromdate);
                if(fromdate) {
                    knsql.append(filter).append("createdate >= ?fromdate");
                    knsql.set("fromdate",fromdate);
                    filter = " and ";
                }
            }
            if(params.todate && params.todate!="") {
                let todate = Utilities.parseDate(params.todate);
                if(todate) {
                    knsql.append(filter).append("createdate <= ?todate");
                    knsql.set("todate",todate);
                    filter = " and ";
                }
            }
            if(params.inactive && params.inactive!="") {
                knsql.append(filter).append("inactive = ?inactive");
                knsql.set("inactive",params.inactive);
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
        let settings = this.getCategorySetting(context, "tkactive");
        return await this.getDataCategories(context, db, settings);
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
        if(eng) {
            knsql.append("tkactive.nameen as activename ");
        } else {
            knsql.append("tkactive.nameth as activename ");
        }
        knsql.append("from ttenant ");
        knsql.append("left join tkactive on tkactive.activeid = ttenant.inactive ");
        knsql.append("where ttenant.tenantid = ?tenantid ");
        knsql.set("tenantid",context.params.tenantid);
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
        return this.createDataTable(KnOperation.COLLECT, this.createRecordSet(rs), {}, "sfte018/sfte018_data");
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
                return this.createDataTable(KnOperation.RETRIEVAL, row, dt.entity, "sfte018/sfte018_dialog");
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
        dt.renderer = "sfte018/sfte018_dialog";
        dt.dataset["tenantid"] = uuid();
        return dt;
    }
    
    protected override async doInserting(context: KnContextInfo, model: KnModel): Promise<KnDataTable> {
        let rs = await this.doCreating(context, model);
        if(rs && rs.rows.length>0) {
            let row = this.transformData(rs.rows[0]);
            return this.createDataTable(KnOperation.INSERT, row);
        }
        return this.createDataTable(KnOperation.INSERT);
    }

    protected override async performCreating(context: any, model: KnModel, db: KnDBConnector) : Promise<KnResultSet> {
        let now = Utilities.now();
        let keypair = KeyTool.generateKeyPair();
        let record = {
            tenantid: context.params.tenantid || uuid(),
            tenantname: context.params.tenantname,
            inactive: context.params.inactive || "0",
            applicationid: uuid(),
            privatekeys: keypair.privateKey,
            publickeys: keypair.publicKey,
            createdate: now,
            createtime: Utilities.currentTime(now),
        };
        let knsql = this.buildInsertQuery(context, model, KnOperation.CREATE);
        this.assignParameters(context,knsql,KnOperation.CREATE,KnOperation.CREATE);
        knsql.set("tenantid",record.tenantid);
        knsql.set("applicationid",record.applicationid);
        knsql.set("privatekeys",record.privatekeys);
        knsql.set("publickeys",record.publickeys);
        knsql.set("createdate",now,"DATE");
        knsql.set("createtime",now,"TIME");
        knsql.set("createuser",this.userToken?.userid);
        let rs = await knsql.executeUpdate(db,context);
        let rcs = this.createRecordSet(rs);
        if(rcs.records>0) {
            rcs.rows = [record];
        }
        return rcs;
    }

}
