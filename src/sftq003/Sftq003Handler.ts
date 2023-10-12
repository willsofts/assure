import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnSQLInterface, KnSQL, KnDBConnector, KnRecordSet } from "@willsofts/will-sql";
import { Utilities } from "@willsofts/will-util";
import { HTTP } from "@willsofts/will-api";
import { KnContextInfo, KnDataTable, KnValidateInfo } from "../models/KnCoreAlias";
import { OPERATE_HANDLERS } from "../models/KnServAlias";
import { VerifyError } from "../models/VerifyError";
import { KnUtility } from "../utils/KnUtility";
import { TknOperateHandler } from '../handlers/TknOperateHandler';

export class Sftq003Handler extends TknOperateHandler {

    public progid = "sftq003";
    public model : KnModel = { 
        name: "trxlog", 
        alias: { privateAlias: this.section }, 
        fields: {
            keyid: { type: "STRING", key: true },
            editdate: { type: "DATE" },
            edittime: { type: "TIME" },
            transtime: { type: "DATETIME" },
            owner: { type: "STRING" },
            sender: { type: "STRING" },
            trxstatus: { type: "STRING" },
            quotable: { type: "STRING" },
            refer: { type: "STRING" },
            package: { type: "STRING" },
            grouper: { type: "STRING" },
            note: { type: "STRING" },
            remark: { type: "STRING" },
            contents: { type: "STRING" },
            statusname: { type: "STRING", calculated: true },
        },
        //prefix naming with table name when select ex. table.column1,table.column2,...
        prefixNaming: true
    };
    public handlers = OPERATE_HANDLERS.concat([ {name: "resend"} ]);

    public async resend(context: KnContextInfo) : Promise<KnRecordSet> {
        return this.callFunctional(context, {operate: "resend", raw: false}, this.doResend);
    }

    protected override validateRequireFields(context: KnContextInfo, model: KnModel, action: string) : Promise<KnValidateInfo> {
        let vi = this.validateParameters(context.params,"keyid");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        return Promise.resolve(vi);
    }

    protected override buildFilterQuery(context: KnContextInfo, model: KnModel, knsql: KnSQLInterface, selector: string, action?: string, subaction?: string): KnSQLInterface {
        if(this.isCollectMode(action)) {
            let eng = KnUtility.isEnglish(context);
            let params = context.params;
            let counting = "count"==subaction;
            knsql.append(selector);
            if(!counting) {
                if(eng) {
                    knsql.append(",tkrxstatus.nameen as statusname ");
                } else {
                    knsql.append(",tkrxstatus.nameth as statusname ");
                }        
            }
            knsql.append(" from ");
            knsql.append(model.name);
            if(!counting) {
                knsql.append(" left join tkrxstatus on tkrxstatus.statusid = trxlog.trxstatus ");    
            }
            let filter = " and ";
            knsql.append(" where processtype = 'mail' ");
            if(params.datefrom && params.datefrom!="") {
                let fromdate = Utilities.parseDate(params.datefrom);
                if(fromdate) {
                    knsql.append(filter).append(model.name).append(".editdate >= ?datefrom ");                
                    knsql.set("datefrom",fromdate);
                    filter = " and ";
                }
            }
            if(params.dateto && params.dateto!="") {
                let todate = Utilities.parseDate(params.dateto);
                if(todate) {
                    knsql.append(filter).append(model.name).append(".editdate <= ?dateto ");
                    knsql.set("dateto",todate);
                    filter = " and ";
                }
            }
            if(params.status && params.status!="") {
                knsql.append(filter).append(model.name).append(".status = ?status ");
                knsql.set("status",params.status);
                filter = " and ";
            }
            if(params.owner && params.owner!="") {
                knsql.append(filter).append(model.name).append(".owner LIKE ?owner ");
                knsql.set("owner","%"+params.owner+"%");
                filter = " and ";
            }
            if(params.quotable && params.quotable!="") {
                knsql.append(filter).append(model.name).append(".quotable LIKE ?quotable ");
                knsql.set("quotable","%"+params.quotable+"%");
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
        let settings = this.getCategorySetting(context, "tkrxstatus");
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
            knsql.append("tkrxstatus.nameen as statusname ");
        } else {
            knsql.append("tkrxstatus.nameth as statusname ");
        }        
        knsql.append("from trxlog ");
        knsql.append("left join tkrxstatus on tkrxstatus.statusid = trxlog.trxstatus ");
        knsql.append("where trxlog.keyid = ?keyid ");
        knsql.set("keyid",context.params.keyid);
        let rs = await knsql.executeQuery(db,context);
        return this.createRecordSet(rs);
    }

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let dt = await this.doCategories(context, model);
        dt.action = KnOperation.EXECUTE;
        return dt;
    }

    public override async getDataSearch(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let rs = await this.doCollecting(context, model);
        return this.createDataTable(KnOperation.COLLECT, rs, {}, "sftq003/sftq003_data");
    }
    
    public override async getDataRetrieval(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let rs =  await this.performRetrieving(context, model, db);
            if(rs.rows.length>0) {
                let row = this.transformData(rs.rows[0]);
                return this.createDataTable(KnOperation.RETRIEVAL, row, {}, "sftq003/sftq003_dialog");
            }
            return this.recordNotFound();
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    public async getDataView(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let dt = await this.getDataRetrieval(context, model);
        dt.renderer = "sftq003/sftq003_dialog_refer";
        return dt;
    }

    public async doResend(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.performRetrieving(context, model, db);
            if(rs && rs.rows.length>0) {
                let row = rs.rows[0];
                let info = {email: row.owner, subject: row.quotable, message: row.contents, refer: context.params.keyid, package: row.package, note: row.note, grouper: row.grouper};
                this.mailing(context, info);
                return rs;
            }
            return this.recordNotFound();
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

}
