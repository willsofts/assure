import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnSQLInterface, KnRecordSet, KnSQL } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { Utilities } from "@willsofts/will-util";
import { TknOperateHandler } from '../handlers/TknOperateHandler';
import { KnValidateInfo, KnContextInfo, KnDataTable } from '../models/KnCoreAlias';
import { VerifyError } from "../models/VerifyError";

export class Demo001Handler extends TknOperateHandler {

    public progid = "demo001";
    public model : KnModel = { 
        name: "sample", 
        alias: { privateAlias: this.section }, 
        fields: {
            fieldchar: { type: "STRING", key: true },
            fielddecimal: { type: "DECIMAL" },
            fielddate: { type: "DATE" },
            fieldtime: { type: "TIME" },
            fieldinteger: { type: "INTEGER" },
            fieldvarchar: { type: "STRING" },
            fieldflag: { type: "STRING", created: true },
            fieldtext: { type: "STRING" },
            fielddatetime: { type: "DATETIME", selected: false, created: true, updated: true, defaultValue: null },
            fieldtimestamp: { type: "DATETIME", selected: false, created: true, updated: true, defaultValue: null },
        },
    };

    /* try to assign individual parameters under this context */
    protected override async assignParameters(context: KnContextInfo, sql: KnSQLInterface, action?: string, mode?: string) {
        console.log("action="+action+",mode="+mode);
        if(KnOperation.COLLECT!=action) {
            let fieldflag = context.params.fieldflag;
            if(!fieldflag || fieldflag=="") fieldflag = "0";
            sql.set("fieldflag",fieldflag);
            sql.set("fielddate",Utilities.parseDate(context.params.fielddate));
            sql.set("fielddecimal",Utilities.parseFloat(context.params.fielddecimal));
            sql.set("fieldinteger",Utilities.parseInteger(context.params.fieldinteger));
        }
        sql.set("fielddatetime",Utilities.now(),"DATETIME");
        sql.set("fieldtimestamp",Utilities.now(),"DATETIME");
    }

    /* try to validate fields for insert, update, delete, retrieve */
    protected override validateRequireFields(context: KnContextInfo, model: KnModel, action: string) : Promise<KnValidateInfo> {
        let vi = this.validateParameters(context.params,"fieldchar");
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
            if(params.fieldchar && params.fieldchar!="") {
                knsql.append(filter).append(model.name).append(".fieldchar LIKE ?fieldchar");
                knsql.set("fieldchar","%"+params.fieldchar+"%");
                filter = " and ";
            }
            if(params.fielddate && params.fielddate!="") {
                let fielddate = Utilities.parseDate(params.fielddate);
                if(fielddate) {
                    knsql.append(filter).append(model.name).append(".fielddate = ?fielddate");
                    knsql.set("fielddate",fielddate);
                    filter = " and ";
                }
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
        let settings = this.getCategorySetting(context, "tkprogtype", "tkactive");
        return await this.getDataCategories(context, db, settings);
        //return await this.getDataLists(context, db, settings);
    }

    /* override to handle launch router when invoked from menu */
    protected override async doRetrieving(context: KnContextInfo, model: KnModel, action: string = KnOperation.RETRIEVE): Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.performRetrieving(context, model, db);
            if(rs.rows.length>0) {
                let row = this.transformData(rs.rows[0]);
                let result = {action: KnOperation.RETRIEVE, entity: {}, dataset: row};
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
        knsql.append("select * from sample where fieldchar = ?fieldchar ");
        knsql.set("fieldchar",context.params.fieldchar);
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
        return {action: "collect", entity: {}, dataset: this.createRecordSet(rs), renderer: "demo001/demo001_data"};
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
                return this.createDataTable(KnOperation.RETRIEVAL, row, dt.entity, "demo001/demo001_dialog");
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
        dt.renderer = "demo001/demo001_dialog";
        return dt;
    }

}
