import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnSQLInterface, KnResultSet, KnRecordSet, KnSQL } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { VerifyError, KnValidateInfo, KnContextInfo, KnDataTable } from '@willsofts/will-core';
import { TknOperateHandler } from '../handlers/TknOperateHandler';

export class Sfte011Handler extends TknOperateHandler {

    public progid = "sfte011";
    public model : KnModel = { 
        name: "tnpwd", 
        alias: { privateAlias: this.section }, 
        fields: {
            reservenum: { type: "STRING", key: true },
            remarks: { type: "STRING" },
            reservenumold: { type: "STRING", calculated: true },
        },
    };

    /* try to validate fields for insert, update, delete, retrieve */
    protected override validateRequireFields(context: KnContextInfo, model: KnModel, action: string) : Promise<KnValidateInfo> {
        let vi = this.validateParameters(context.params,"reservenum");
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
            if(params.reservenum && params.reservenum!="") {
                knsql.append(filter).append("reservenum LIKE ?reservenum");
                knsql.set("reservenum","%"+params.reservenum+"%");
                filter = " and ";
            }
            return knsql;    
        }
        return super.buildFilterQuery(context, model, knsql, selector, action, subaction);
    }

    public override async doRetrieving(context: KnContextInfo, model: KnModel, action: string = KnOperation.RETRIEVE): Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.performRetrieving(context, model, db);
            if(rs.rows.length>0) {
                let row = this.transformData(rs.rows[0]);
                row.reservenumold = row.reservenum;
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

    public async performRetrieving(context: KnContextInfo, model: KnModel, db: KnDBConnector): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("select * from tnpwd ");
        knsql.append("where reservenum = ?reservenum ");
        knsql.set("reservenum",context.params.reservenum);
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
        return this.createDataTable(KnOperation.COLLECT, this.createRecordSet(rs), {}, "sfte011/sfte011_data");
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
                row.reservenumold = row.reservenum;
                return this.createDataTable(KnOperation.RETRIEVAL, row, {}, "sfte011/sfte011_dialog");
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
        return this.createDataTable(KnOperation.ADD, {}, {}, "sfte011/sfte011_dialog");
    }
    
    public override async performUpdating(context: any, model: KnModel, db: KnDBConnector): Promise<KnResultSet> {
        let sql = new KnSQL();
        sql.append("update tnpwd set reservenum=?reservenum, remarks = ?remarks ");
        sql.append("where reservenum = ?reservenumold ");
        sql.set("reservenum",context.params.reservenum);
        sql.set("remarks",context.params.remarks);
        sql.set("reservenumold",context.params.reservenumold);
        return await sql.executeUpdate(db,context);
    }

    public override async doInsert(context: KnContextInfo, model: KnModel) : Promise<any> {
        return super.doInsert(context, model);
    }

    public async doRetrieval(context: KnContextInfo, model: KnModel) : Promise<any> {
        return super.doRetrieval(context, model);
    }

    public override async doUpdate(context: KnContextInfo, model: KnModel) : Promise<any> {
        return super.doUpdate(context, model);
    }

    public override async doRemove(context: KnContextInfo, model: KnModel) : Promise<any> {
        return super.doRemove(context, model);
    }

    public override async doSearch(context: KnContextInfo, model: KnModel) : Promise<any> {
        return super.doSearch(context, model);
    }

    public override async doAdd(context: KnContextInfo, model: KnModel) : Promise<any> {
        return super.doAdd(context, model);
    }
    
}
