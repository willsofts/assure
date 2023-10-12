import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnSQLInterface, KnResultSet, KnRecordSet, KnSQL } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { TknOperateHandler } from '../handlers/TknOperateHandler';
import { TknPasswordStrategyHandler } from "../handlers/TknPasswordStrategyHandler";
import { OPERATE_HANDLERS } from "../models/KnServAlias";
import { KnValidateInfo, KnContextInfo, KnDataTable } from '../models/KnCoreAlias';
import { VerifyError } from '../models/VerifyError';
import { Sfte011Handler } from "../sfte011/Sfte011Handler";

export class Sfte010Handler extends TknOperateHandler {

    public progid = "sfte010";
    public model : KnModel = { 
        name: "trpwd", 
        alias: { privateAlias: this.section }, 
        fields: {
            reservepwd: { type: "STRING", key: true },
            reservepwdold: { type: "STRING", calculated: true },
        },
    };
    public handlers = OPERATE_HANDLERS.concat([
        {name: "insertpolicy"}, {name: "updatepolicy"},
        {name: "insertnum"}, {name: "retrievalnum"}, {name: "updatenum"}, {name: "removenum"}, {name: "searchnum"}, {name: "addnum"}
    ]);

    /* try to validate fields for insert, update, delete, retrieve */
    protected override validateRequireFields(context: KnContextInfo, model: KnModel, action: string) : Promise<KnValidateInfo> {
        let vi = this.validateParameters(context.params,"reservepwd");
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
            if(params.reservepwd && params.reservepwd!="") {
                knsql.append(filter).append("reservepwd LIKE ?reservepwd");
                knsql.set("reservepwd","%"+params.reservepwd+"%");
                filter = " and ";
            }
            return knsql;    
        }
        return super.buildFilterQuery(context, model, knsql, selector, action, subaction);
    }

    protected override async doRetrieving(context: KnContextInfo, model: KnModel, action: string = KnOperation.RETRIEVE): Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.performRetrieving(context, model, db);
            if(rs.rows.length>0) {
                let row = this.transformData(rs.rows[0]);
                row.reservepwdold = row.reservepwd;
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
        knsql.append("select * from trpwd ");
        knsql.append("where reservepwd = ?reservepwd ");
        knsql.set("reservepwd",context.params.reservepwd);
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
        return this.createDataTable(KnOperation.COLLECT, this.createRecordSet(rs), {}, "sfte010/sfte010_data");
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
                row.reservepwdold = row.reservepwd;
                return this.createDataTable(KnOperation.RETRIEVAL, row, {}, "sfte010/sfte010_dialog");
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
        return this.createDataTable(KnOperation.ADD, {}, {}, "sfte010/sfte010_dialog");
    }
    
    protected override async performUpdating(context: any, model: KnModel, db: KnDBConnector): Promise<KnResultSet> {
        let sql = new KnSQL();
        sql.append("update trpwd set reservepwd=?reservepwd ");
        sql.append("where reservepwd = ?reservepwdold ");
        sql.set("reservepwd",context.params.reservepwd);
        sql.set("reservepwdold",context.params.reservepwdold);
        return await sql.executeUpdate(db,context);
    }

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let handler = new TknPasswordStrategyHandler();
            let rs =  await handler.performRetrievePolicy(db); 
            if(rs.rows.length>0) {
                let row = handler.transformData(rs.rows[0]);
                return this.createDataTable(KnOperation.RETRIEVAL, row, {}, "sfte010/sfte010");
            }
            return this.createDataTable(KnOperation.ADD, {}, {}, "sfte010/sfte010");
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    public async insertpolicy(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: KnOperation.INSERT, raw: false}, this.doInsertPolicy);
    }

    public async updatepolicy(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: KnOperation.UPDATE, raw: false}, this.doUpdatePolicy);
    }

    public async doInsertPolicy(context: KnContextInfo, model: KnModel) : Promise<any> {
        let handler = new TknPasswordStrategyHandler();
        return await handler.doInsert(context, handler.model);
    }

    public async doUpdatePolicy(context: KnContextInfo, model: KnModel) : Promise<any> {
        let handler = new TknPasswordStrategyHandler();
        return await handler.doUpdate(context, handler.model);
    }

    public async insertnum(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: KnOperation.INSERT, raw: false}, this.doInsertNumber);
    }

    public async retrievalnum(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: KnOperation.RETRIEVAL, raw: true}, this.doRetrievalNumber);
    }

    public async updatenum(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: KnOperation.UPDATE, raw: false}, this.doUpdateNumber);
    }

    public async removenum(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: KnOperation.REMOVE, raw: false}, this.doRemoveNumber);
    }

    public async searchnum(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: KnOperation.SEARCH, raw: true}, this.doSearchNumber);
    }

    public async addnum(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: KnOperation.ADD, raw: true}, this.doAddNumber);
    }

    public async doInsertNumber(context: KnContextInfo, model: KnModel) : Promise<any> {
        let handler = new Sfte011Handler();
        return await handler.doInsert(context, handler.model);
    }

    public async doRetrievalNumber(context: KnContextInfo, model: KnModel) : Promise<any> {
        let handler = new Sfte011Handler();
        let ds = await handler.getDataRetrieval(context, handler.model);
        ds.renderer = "sfte010/sfte011_dialog";
        return this.buildHtml("/views/"+ds.renderer, ds, context);
    }

    public async doUpdateNumber(context: KnContextInfo, model: KnModel) : Promise<any> {
        let handler = new Sfte011Handler();
        return await handler.doUpdate(context, handler.model);
    }

    public async doRemoveNumber(context: KnContextInfo, model: KnModel) : Promise<any> {
        let handler = new Sfte011Handler();
        return await handler.doRemove(context, handler.model);
    }

    public async doSearchNumber(context: KnContextInfo, model: KnModel) : Promise<any> {
        let handler = new Sfte011Handler();
        let ds = await handler.getDataSearch(context, handler.model);
        ds.renderer = "sfte010/sfte011_data";
        return this.buildHtml("/views/"+ds.renderer, ds, context);
    }

    public async doAddNumber(context: KnContextInfo, model: KnModel) : Promise<any> {
        let handler = new Sfte011Handler();
        let ds = await handler.getDataAdd(context, handler.model);
        ds.renderer = "sfte010/sfte011_dialog";
        return this.buildHtml("/views/"+ds.renderer, ds, context);
    }

}
