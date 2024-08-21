import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnSQLInterface, KnRecordSet, KnSQL } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { Utilities } from "@willsofts/will-util";
import { TknOperateHandler } from '../handlers/TknOperateHandler';
import { KnValidateInfo, KnContextInfo, KnDataTable } from '../models/KnCoreAlias';
import { VerifyError } from "../models/VerifyError";

export class Demo002Handler extends TknOperateHandler {

    public progid = "demo002";
    public model : KnModel = { 
        name: "sampling", 
        alias: { privateAlias: this.section }, 
        fields: {
            account: { type: "STRING", key: true },
            amount: { type: "DECIMAL" },
            age: { type: "INTEGER" },
            gender: { type: "STRING" },
            domestic: { type: "STRING"},
            effectdate: { type: "DATE" },
            effecttime: { type: "TIME" },
            pincode: { type: "STRING" },
            marrystatus: { type: "STRING" },
            licenses: { type: "STRING", created: true, updated: true },
            languages: { type: "STRING", created: true, updated: true },
            remark: { type: "STRING" },
            title: { type: "STRING" },
            caption: { type: "STRING" },
            assets: { type: "INTEGER" },
            credit: { type: "DECIMAL" },
            passcode: { type: "STRING" },
            createdate: { type: "DATE", created: true },
            createtime: { type: "TIME", created: true },
            createuser: { type: "STRING", created: true, updated: false, selected: false },
            editdate: { type: "DATE", created: true, updated: true },
            edittime: { type: "TIME", created: true, updated: true },
            edituser: { type: "STRING", created: true, updated: true, selected: false },
        },
    };

    /* try to assign individual parameters under this context */
    protected override async assignParameters(context: KnContextInfo, sql: KnSQLInterface, action?: string, mode?: string) {
        console.log("action="+action+",mode="+mode);
        if(KnOperation.COLLECT != action) {
            let tokenInfo = await this.getUserTokenInfo(context,true);
            let curuser = tokenInfo?.userid;
            let createdate = Utilities.parseDate(context.params.createdate);
            let createtime = Utilities.parseTime(context.params.createtime);
            let editdate = Utilities.parseDate(context.params.editdate);
            let edittime = Utilities.parseTime(context.params.edittime);
            let now = Utilities.now();
            let licenses = this.getParameterArray("licenses",context.params);
            let languages = this.getParameterArray("languages",context.params);
            sql.set("licenses",licenses ? licenses.join(",") : licenses);
            sql.set("languages",languages ? languages.join(",") : languages);
            sql.set("amount",Utilities.parseFloat(context.params.amount));
            sql.set("age",Utilities.parseInteger(context.params.age));
            sql.set("effectdate",Utilities.parseDate(context.params.effectdate),"DATE");
            sql.set("effecttime",Utilities.parseTime(context.params.effecttime),"TIME");
            sql.set("createdate",createdate?createdate:now,"DATE");
            sql.set("createtime",createtime?createtime:now,"TIME");
            sql.set("createuser",curuser);
            sql.set("editdate",editdate?editdate:now,"DATE");
            sql.set("edittime",edittime?edittime:now,"TIME");
            sql.set("edituser",curuser);
            sql.set("assets",Utilities.parseInteger(context.params.assets));
            sql.set("credit",Utilities.parseFloat(context.params.credit));
        }
    }

    /* try to validate fields for insert, update, delete, retrieve */
    protected override validateRequireFields(context: KnContextInfo, model: KnModel, action: string) : Promise<KnValidateInfo> {
        let vi = this.validateParameters(context.params,"account");
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
            if(params.account && params.account!="") {
                knsql.append(filter).append(model.name).append(".account LIKE ?account");
                knsql.set("account","%"+params.account+"%");
                filter = " and ";
            }
            if(params.effectdate && params.effectdate!="") {
                let effectdate = Utilities.parseDate(params.effectdate);
                if(effectdate) {
                    knsql.append(filter).append(model.name).append(".effectdate = ?effectdate");
                    knsql.set("effectdate",effectdate);
                    filter = " and ";
                }
            }
            /*
            let marrystatus = context.params["marrystatus[]"];
            if(marrystatus && !Array.isArray(marrystatus)) marrystatus = [marrystatus];
            if(!marrystatus && context.params.marrystatus) {
                marrystatus = context.params.marrystatus;
                if(!Array.isArray(marrystatus)) marrystatus = [context.params.marrystatus];
            }
            if(marrystatus && Array.isArray(marrystatus)) {
            */
            let marrystatus = this.getParameterArray("marrystatus",params);
            if(marrystatus) {
                let marrystatuses = marrystatus.map(item => "'"+item+"'").join(",");
                knsql.append(filter).append(model.name).append(".marrystatus IN (").append(marrystatuses).append(")");
                filter = " and ";
            }
            if(params.title && params.title!="") {
                knsql.append(filter).append(model.name).append(".title LIKE ?title");
                knsql.set("title","%"+params.title+"%");
                filter = " and ";
            }
            return knsql;    
        }
        return super.buildFilterQuery(context, model, knsql, selector, action, subaction);
    }

    /* override to handle launch router when invoked from menu */
    protected override async doRetrieving(context: KnContextInfo, model: KnModel, action: string = KnOperation.RETRIEVE): Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.performRetrieving(context, model, db);
            if(rs.rows.length>0) {
                let row = this.transformData(rs.rows[0]);
                let licenses = row.licenses;
                let languages = row.languages;
                if(licenses && licenses.trim().length>0) licenses = licenses.split(",");
                if(languages && languages.trim().length>0) languages = languages.split(",");
                row.licenses = licenses ? licenses : [];
                row.languages = languages ? languages : [];
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
        knsql.append("select * from ").append(this.model.name).append(" where account = ?account ");
        knsql.set("account",context.params.account);
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
        return {action: "collect", entity: {}, dataset: this.createRecordSet(rs), renderer: "demo002/demo002_data"};
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
                return this.createDataTable(KnOperation.RETRIEVAL, row, {}, "demo002/demo002_dialog");
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
        dt.renderer = "demo002/demo002_dialog";
        return dt;
    }

}
