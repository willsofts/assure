import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnSQLInterface, KnResultSet, KnRecordSet, KnSQL } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { TknDataTableHandler, VerifyError, KnValidateInfo, KnContextInfo, KnDataTable } from '@willsofts/will-core';
import { Utilities } from "@willsofts/will-util";
import { TknOperateHandler } from '../handlers/TknOperateHandler';

export class Sfte013Handler extends TknOperateHandler {

    public progid = "sfte013";
    public model : KnModel = { 
        name: "ttemplate", 
        alias: { privateAlias: this.section }, 
        fields: {
            template: { type: "STRING", key: true },
            templatetype: { type: "STRING", key: true },
            subjecttitle: { type: "STRING" },
            contents: { type: "STRING" },
            contexts: { type: "STRING", created: true, updated: true, defaultValue: null },
            editdate: { type: "DATE", selected: false, created: true, updated: true, defaultValue: null },
            edittime: { type: "TIME", selected: false, created: true, updated: true, defaultValue: null },
            edituser: { type: "STRING", selected: false, created: true, updated: true, defaultValue: null }
        },
    };

    /* try to assign individual parameters under this context */
    protected override assignParameters(context: KnContextInfo, sql: KnSQLInterface, action?: string, mode?: string) {
        sql.set("contexts",context.params.contents);
        sql.set("editdate",Utilities.now(),"DATE");
        sql.set("edittime",Utilities.now(),"TIME");
        sql.set("edituser",this.userToken?.userid);
    }

    /* try to validate fields for insert, update, delete, retrieve */
    protected override validateRequireFields(context: KnContextInfo, model: KnModel, action: string) : Promise<KnValidateInfo> {
        let vi = this.validateParameters(context.params,"template","templatetype");
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
            if(params.template && params.template!="") {
                knsql.append(filter).append("template LIKE ?template");
                knsql.set("template","%"+params.template+"%");
                filter = " and ";
            }
            if(params.templatetype && params.templatetype!="") {
                knsql.append(filter).append("templatetype LIKE ?templatetype");
                knsql.set("templatetype","%"+params.templatetype+"%");
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
        let settings = this.getCategorySetting(context, "ttemplatetag");
        return await this.getDataCategories(context, db, settings);
    }

    /* override to handle launch router when invoked from menu */
    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let settings = this.getCategorySetting(context, "ttemplatetag");
            let handler = new TknDataTableHandler();
            let dt = await handler.getDataCategory(db, settings, true, context);
            let tagary = [];
            let tagmap = dt.ttemplatetag;
            if(tagmap) {
                for(let key in tagmap) {
                    tagary.push({value: key, text: tagmap[key]});
                }
            }
            dt["ttemplateary"] = tagary;
            return this.createDataTable(KnOperation.EXECUTE, {}, dt, "sfte013/sfte013");
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
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
        knsql.append("select * from ttemplate ");
        knsql.append("where template = ?template ");
        knsql.append("and templatetype = ?templatetype ");
        knsql.set("template",context.params.template);
        knsql.set("templatetype",context.params.templatetype);
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
        return this.createDataTable(KnOperation.COLLECT, this.createRecordSet(rs), {}, "sfte013/sfte013_data");
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
                return this.createDataTable(KnOperation.RETRIEVAL, row, {}, "sfte013/sfte013_dialog");
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
        return this.createDataTable(KnOperation.ADD, {}, {}, "sfte013/sfte013_dialog");
    }
    
    public async moveToHistory(context: KnContextInfo, db: KnDBConnector) : Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("insert into ttemplatehistory ");
        knsql.append("select * from ttemplate ");
        knsql.append("where template = ?template and templatetype = ?templatetype ");
        knsql.set("template",context.params.template);
        knsql.set("templatetype",context.params.templatetype);
        let rs = await knsql.executeUpdate(db,context);
        return this.createRecordSet(rs);
    }

    protected override async performUpdating(context: any, model: KnModel, db: KnDBConnector): Promise<KnResultSet> {
        await this.moveToHistory(context, db);
        return super.performUpdating(context, model, db);
    }

    protected override async performClearing(context: any, model: KnModel, db: KnDBConnector): Promise<KnResultSet> {
        await this.moveToHistory(context, db);
        return super.performClearing(context, model, db);
    }

}
