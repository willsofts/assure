import { KnModel, KnOperation, KnPageSetting } from "@willsofts/will-db";
import { KnDBConnector, KnSQLInterface, KnRecordSet, KnSQL } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { KnValidateInfo, KnContextInfo, KnDataTable } from '../models/KnCoreAlias';
import { VerifyError } from '../models/VerifyError';
import { KnUtility } from '../utils/KnUtility';
import { Utilities } from "@willsofts/will-util";
import { TknOperateHandler } from '../handlers/TknOperateHandler';

export class Sfte017Handler extends TknOperateHandler {

    public progid = "sfte017";
    public model : KnModel = { 
        name: "tuserfactor", 
        alias: { privateAlias: this.section }, 
        fields: {
            userid: { type: "STRING", key: true },
            email: { type: "STRING" },
            issuer: { type: "STRING" },
            createdate: { type: "DATE" },
            createtime: { type: "TIME" },
            confirmdate: { type: "DATE" },
            confirmtime: { type: "TIME" },
            factorflag: { type: "STRING" },
            username: { type: "STRING", calculated: true },
            usersurname: { type: "STRING", calculated: true },
            fromdate: { type: "DATE", calculated: true },
            todate: { type: "DATE", calculated: true },
        },
        //prefix naming with table name when select ex. table.column1,table.column2,...
        prefixNaming: true
    };

    /* try to validate fields for insert, update, delete, retrieve */
    protected override validateRequireFields(context: KnContextInfo, model: KnModel, action: string) : Promise<KnValidateInfo> {
        let vi = this.validateParameters(context.params,"userid");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        return Promise.resolve(vi);
    }
    protected override buildFilterQuery(context: any, model: KnModel, knsql: KnSQLInterface, selector: string, action?: string, subaction?: string): KnSQLInterface {
        if(this.isCollectMode(action)) {
            let eng = KnUtility.isEnglish(context);
            let params = context.params;
            let counting = KnOperation.COUNT==subaction;
            knsql.append(selector);
            if(!counting) {
                if(eng) {
                    knsql.append(", tuserinfo.userename as username, ");
                    knsql.append("tuserinfo.useresurname as usersurname ");
                }else {
                    knsql.append(", tuserinfo.usertname as username, ");
                    knsql.append("tuserinfo.usertsurname as usersurname ");
                }
            }
            knsql.append(" from ");
            knsql.append(model.name);
            knsql.append(" LEFT JOIN tuserinfo ON tuserinfo.userid = tuserfactor.userid ");  
            let filter = " where ";
            if(params.userid && params.userid!="") {
                knsql.append(filter).append(model.name).append(".userid LIKE ?userid ");
                knsql.set("userid","%"+params.userid+"%");
                filter = " and ";
            }
            if(params.username && params.username!="") {
                if(eng) {
                    knsql.append(filter).append(" tuserinfo.userename like ?username or useresurname like ?usersurname ");
                } else {
                    knsql.append(filter).append(" tuserinfo.usertname like ?username or usertsurname like ?usersurname ");
                }
                knsql.set("username","%"+params.username+"%");
                knsql.set("usersurname","%"+params.username+"%");
                filter = " and ";
            }
            if(params.email && params.email!="") {
                knsql.append(filter).append("tuserfactor.email LIKE ?email ");
                knsql.set("email","%"+params.email+"%");
                filter = " and ";
            }
            if(params.fromdate && params.fromdate!="") {
                let fromdate = Utilities.parseDate(params.fromdate);
                if(fromdate) {
                    knsql.append(filter).append(model.name).append(".createdate >= ?fromdate ");
                    knsql.set("fromdate",fromdate);
                    filter = " and ";
                }
            }
            if(params.todate && params.todate!="") {
                let todate = Utilities.parseDate(params.todate);
                if(todate) {
                    knsql.append(filter).append(model.name).append(".createdate <= ?todate ");
                    knsql.set("todate",todate);
                    filter = " and ";
                }
            }
            return knsql;    
        }
        return super.buildFilterQuery(context, model, knsql, selector, action, subaction);
    }

    protected override buildOrderQuery(context: any, model: KnModel, knsql: KnSQLInterface, pageSetting: KnPageSetting, action?: string, subaction?: string): KnSQLInterface {
        let order = pageSetting.orderDir?pageSetting.orderDir:"";
        if("username_surname"==pageSetting.orderBy) {
            let eng = KnUtility.isEnglish(context);
            if(eng) {
                knsql.append(" order by userename ").append(order).append(", useresurname ").append(order).append(" ");
            }else {
                knsql.append(" order by usertname ").append(order).append(", usertsurname ").append(order).append(" ");
            }    
            return knsql;
        } else if("createdatetime"==pageSetting.orderBy) {
            knsql.append(" order by createdate ").append(order).append(", createtime ").append(order).append(" ");
            return knsql;
        } else if("confirmdatetime"==pageSetting.orderBy) {
            knsql.append(" order by confirmdate ").append(order).append(", confirmtime ").append(order).append(" ");
            return knsql;
        }
        return super.buildOrderQuery(context, model, knsql, pageSetting, action, subaction);
    }

    protected override async doRetrieving(context: KnContextInfo, model: KnModel, action: string = KnOperation.RETRIEVE): Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.performRetrieving(context, model, db);
            if(rs.rows.length>0) {
                let row = this.transformData(rs.rows[0]);
                let result = {action: action, entity: {}, dataset: row};
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

    public async performRetrieving(context: KnContextInfo, model: KnModel, db: KnDBConnector): Promise<KnRecordSet> {
        let eng = KnUtility.isEnglish(context);
        let knsql = new KnSQL();
        knsql.append("select ").append(this.buildSelectField(context,model)).append(",");
        if(eng) {
            knsql.append(" tuserinfo.userename as username, ");
            knsql.append(" tuserinfo.useresurname as usersurname ");
        }else {
            knsql.append(" tuserinfo.usertname as username, ");
            knsql.append(" tuserinfo.usertsurname as usersurname ");
        }
        knsql.append("from tuserfactor, tuserinfo ");
        knsql.append("where tuserfactor.userid = ?userid ");
        knsql.append("and tuserfactor.userid = tuserinfo.userid ");
        knsql.set("userid",context.params.userid);
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
        return this.createDataTable(KnOperation.COLLECT, this.createRecordSet(rs), {}, "sfte017/sfte017_data");
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
                return this.createDataTable(KnOperation.RETRIEVAL, row, {}, "sfte017/sfte017_dialog");
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
