import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnSQLInterface, KnRecordSet, KnSQL } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { TknDataTableHandler, VerifyError, KnValidateInfo, KnContextInfo, KnDataTable } from '@willsofts/will-core';
import { Utilities } from "@willsofts/will-util";
import { TknOperateHandler } from '../handlers/TknOperateHandler';

export class Sfte001Handler extends TknOperateHandler {

    public progid = "sfte001";
    public model : KnModel = { 
        name: "tprog", 
        alias: { privateAlias: this.section }, 
        fields: {
            programid: { type: "STRING", key: true },
            product: { type: "STRING" },
            progname: { type: "STRING" },
            prognameth: { type: "STRING" },
            progtype: { type: "STRING" },
            appstype: { type: "STRING" },
            description: { type: "STRING" },
            parameters: { type: "STRING" },
            progsystem: { type: "STRING" },
            iconfile: { type: "STRING" },
            iconstyle: { type: "STRING" },
            shortname: { type: "STRING" },
            shortnameth: { type: "STRING" },
            progpath: { type: "STRING" },
            editdate: { type: "DATE", selected: false, created: true, updated: true, defaultValue: null },
            edittime: { type: "TIME", selected: false, created: true, updated: true, defaultValue: null },
            edituser: { type: "STRING", selected: false, created: true, updated: true, defaultValue: null }
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
        let vi = this.validateParameters(context.params,"programid");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        return Promise.resolve(vi);
    }

    protected override buildFilterQuery(context: KnContextInfo, model: KnModel, knsql: KnSQLInterface, selector: string, action?: string, subaction?: string): KnSQLInterface {
        if(this.isCollectMode(action)) {
            let params = context.params;
            let counting = KnOperation.COUNT==subaction;
            knsql.append(selector);
            if(!counting) {
                knsql.append(", tprogtype.nameen as progtypedesc ");
            }
            knsql.append(" from ");
            knsql.append(model.name);
            if(!counting) {
                knsql.append(" left join tprogtype on tprogtype.progtype = tprog.progtype ");    
            }
            let filter = " where ";
            if(params.product && params.product!="") {
                knsql.append(filter).append(model.name).append(".product = ?product");
                knsql.set("product",params.product);
                filter = " and ";
            }
            if(params.programid && params.programid!="") {
                knsql.append(filter).append(model.name).append(".programid LIKE ?programid");
                knsql.set("programid","%"+params.programid+"%");
                filter = " and ";
            }
            if(params.progname && params.progname!="") {
                knsql.append(filter).append(model.name).append(".progname LIKE ?progname");
                knsql.set("progname","%"+params.progname+"%");
                filter = " and ";
            }
            if(params.progtype && params.progtype!="") {
                knsql.append(filter).append(model.name).append(".progtype = ?progtype");
                knsql.set("progtype",params.progtype);
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
        let settings = this.getCategorySetting(context, "tprod", "tappstype", "tprogtype", "tsystemtype");
        return await this.getDataCategories(context, db, settings);
    }

    /* override to handle launch router when invoked from menu */
    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let settings = this.getCategorySetting(context, "tprogtype");
            let handler = new TknDataTableHandler();
            let dt = await handler.getDataCategory(db, settings, true, context);
            let ds = this.emptyDataSet();
            return this.createDataTable(KnOperation.EXECUTE, ds, dt);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    protected getIconImage(iconfile?: string) : string {
        let iconimage = "/img/apps/apps.png";
        if(iconfile && iconfile.trim().length>0) {
            iconimage = "/img/apps/"+iconfile;
        }
        return iconimage;
    }

    protected override async doRetrieving(context: KnContextInfo, model: KnModel, action: string = KnOperation.RETRIEVE): Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.performRetrieving(context, model, db);
            if(rs.rows.length>0) {
                let row = this.transformData(rs.rows[0]);
                row["iconimage"] = this.getIconImage(row.iconfile);
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
        knsql.append("select * from tprog where programid = ?programid ");
        knsql.set("programid",context.params.programid);
        let rs = await knsql.executeQuery(db);
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
        return this.createDataTable(KnOperation.COLLECT, this.createRecordSet(rs), {}, "sfte001/sfte001_data");
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
                row["iconimage"] = this.getIconImage(row.iconfile);
                let dt = await this.performCategories(context, model, db);
                return this.createDataTable(KnOperation.RETRIEVAL, row, dt.entity, "sfte001/sfte001_dialog");
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
        dt.renderer = "sfte001/sfte001_dialog";
        dt.dataset["iconimage"] = this.getIconImage();
        return dt;
    }

}
