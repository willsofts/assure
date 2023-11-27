import { v4 as uuid } from 'uuid';
import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnSQLInterface, KnRecordSet, KnSQL } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { KnValidateInfo, KnContextInfo, KnDataTable } from '../models/KnCoreAlias';
import { VerifyError } from '../models/VerifyError';
import { KnPageUtility } from '../utils/KnPageUtility';
import { KnUtility } from '../utils/KnUtility';
import { Utilities } from "@willsofts/will-util";
import { TknOperateHandler } from '../handlers/TknOperateHandler';

export class Sfte009Handler extends TknOperateHandler {

    public progid = "sfte009";
    public model : KnModel = { 
        name: "tdirectory", 
        alias: { privateAlias: this.section }, 
        fields: {
            domainid: { type: "STRING", key: true },
            domainname: { type: "STRING" },
            description: { type: "STRING", created: true },
            applicationid: { type: "STRING", created: true },
            tenanturl: { type: "STRING", created: true },
            secretkey: { type: "STRING", created: true },
            systemtype: { type: "STRING", created: true, defaultValue: "W" },
            appstype: { type: "STRING", created: true, defaultValue: "W" },
            domaintype: { type: "STRING", created: true, defaultValue: "S" },
            domainurl: { type: "STRING" },
            basedn: { type: "STRING", created: true },
            inactive: { type: "STRING", created: true, defaultValue: "0" },
            invisible: { type: "STRING", created: true, defaultValue: "0" },
            editdate: { type: "DATE", selected: false, created: true, updated: true, defaultValue: null },
            edittime: { type: "TIME", selected: false, created: true, updated: true, defaultValue: null },
            edituser: { type: "STRING", selected: false, created: true, updated: true, defaultValue: null },
            systemname: { type: "STRING", calculated: true },
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
            vi = this.validateParameters(context.params,"domainname");
        } else {
            vi = this.validateParameters(context.params,"domainid");
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
                    knsql.append(", tconstant.nameen as systemname ");
                } else {
                    knsql.append(", tconstant.nameth as systemname ");
                }
            }
            knsql.append(" from ");
            knsql.append(model.name);
            if(!counting) {
                knsql.append(" left join tconstant on tconstant.typename = 'tsystemtype' and tconstant.typeid = tdirectory.systemtype ");
            }
            let filter = " where ";
            if(params.domainname && params.domainname!="") {
                knsql.append(filter).append("domainname LIKE ?domainname");
                knsql.set("domainname","%"+params.domainname+"%");
                filter = " and ";
            }
            if(params.description && params.description!="") {
                knsql.append(filter).append("description LIKE ?description");
                knsql.set("description","%"+params.description+"%");
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
        let settings = this.getCategorySetting(context, "tkactive", "tkvisible", "tksystemtype", "tkdomaintype", "tkdomainappstype");
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
            knsql.append("tconstant.nameen as systemname ");
        } else {
            knsql.append("tconstant.nameth as systemname ");
        }
        knsql.append("from tdirectory ");
        knsql.append("left join tconstant on tconstant.typename = 'tsystemtype' and tconstant.typeid = tdirectory.systemtype ");
        knsql.append("where tdirectory.domainid = ?domainid ");
        knsql.set("domainid",context.params.domainid);
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
        return this.createDataTable(KnOperation.COLLECT, this.createRecordSet(rs), {}, "sfte009/sfte009_data");
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
                return this.createDataTable(KnOperation.RETRIEVAL, row, dt.entity, "sfte009/sfte009_dialog");
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
        dt.renderer = "sfte009/sfte009_dialog";
        dt.dataset["domainid"] = uuid();
        return dt;
    }
    
}
