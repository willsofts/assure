import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnSQLInterface, KnRecordSet, KnSQL } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { Utilities } from "@willsofts/will-util";
import { TknOperateHandler } from '../handlers/TknOperateHandler';
import { KnValidateInfo, KnContextInfo, KnDataTable } from '../models/KnCoreAlias';
import { VerifyError } from "../models/VerifyError";

export class Sfte003Handler extends TknOperateHandler {

    public progid = "sfte003";
    public model : KnModel = { 
        name: "tprod", 
        alias: { privateAlias: this.section }, 
        fields: {
            product: { type: "STRING", key: true },
            nameen: { type: "STRING" },
            nameth: { type: "STRING" },
            seqno: { type: "INTEGER" },
            url: { type: "STRING" },
            verified: { type: "STRING" },
            centerflag: { type: "STRING" },
            iconfile: { type: "STRING" },
            editdate: { type: "DATE", selected: false, created: true, updated: true, defaultValue: null },
            edittime: { type: "TIME", selected: false, created: true, updated: true, defaultValue: null },
            edituser: { type: "STRING", selected: false, created: true, updated: true, defaultValue: null }
        },
    };

    /* try to assign individual parameters under this context */
    protected override assignParameters(context: KnContextInfo, sql: KnSQLInterface, action?: string, mode?: string) {
        console.log("action="+action+",mode="+mode);
        if(KnOperation.COLLECT!=action) {
            let verified = context.params.verified;
            if(!verified || verified=="") verified = "0";
            let centerflag = context.params.centerflag;
            if(!centerflag || centerflag=="") centerflag = "0";
            sql.set("verified",verified);
            sql.set("centerflag",centerflag);
        }
        sql.set("editdate",Utilities.now(),"DATE");
        sql.set("edittime",Utilities.now(),"TIME");
        sql.set("edituser",this.userToken?.userid);
    }

    /* try to validate fields for insert, update, delete, retrieve */
    protected override validateRequireFields(context: KnContextInfo, model: KnModel, action: string) : Promise<KnValidateInfo> {
        let vi = this.validateParameters(context.params,"product");
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
            if(params.product && params.product!="") {
                knsql.append(filter).append(model.name).append(".product LIKE ?product");
                knsql.set("product","%"+params.product+"%");
                filter = " and ";
            }
            if(params.nameen && params.nameen!="") {
                knsql.append(filter).append(model.name).append(".nameen LIKE ?nameen");
                knsql.set("nameen","%"+params.nameen+"%");
                filter = " and ";
            }
            if(params.nameth && params.nameth!="") {
                knsql.append(filter).append(model.name).append(".nameth LIKE ?nameth");
                knsql.set("nameth","%"+params.nameth+"%");
                filter = " and ";
            }
            if(params.verified && params.verified!="") {
                knsql.append(filter).append(model.name).append(".verified = ?verified");
                knsql.set("verified",params.verified);
                filter = " and ";
            }
            return knsql;    
        }
        return super.buildFilterQuery(context, model, knsql, selector, action, subaction);
    }

    protected getIconImage(iconfile?: string): string {
        let iconimage = "/img/module/module.png";
        if(iconfile && iconfile.trim().length>0) {
            iconimage = "/img/module/"+iconfile;
        }
        return iconimage;
    }

    /* override to handle launch router when invoked from menu */
    protected override async doRetrieving(context: KnContextInfo, model: KnModel, action: string = KnOperation.RETRIEVE): Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.performRetrieving(context, model, db);
            if(rs.rows.length>0) {
                let row = this.transformData(rs.rows[0]);
                row["iconimage"] = this.getIconImage(row.iconfile);
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
        knsql.append("select * from tprod where product = ?product ");
        knsql.set("product",context.params.product);
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
        return {action: "collect", entity: {}, dataset: this.createRecordSet(rs), renderer: "sfte003/sfte003_data"};
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
                return this.createDataTable(KnOperation.RETRIEVAL, row, {}, "sfte003/sfte003_dialog");
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
        let dt = this.createDataTable(KnOperation.ADD);
        dt.renderer = "sfte003/sfte003_dialog";
        dt.dataset["iconimage"] = this.getIconImage();
        return dt;
    }

}
