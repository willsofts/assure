import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnRecordSet, KnSQL } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { KnValidateInfo, KnContextInfo, KnDataTable } from '../models/KnCoreAlias';
import { VerifyError } from '../models/VerifyError';
import { TknProcessHandler } from './TknProcessHandler';

export class TknPasswordStrategyHandler extends TknProcessHandler {

    public progid = "strategy";
    public model : KnModel = { 
        name: "tppwd", 
        alias: { privateAlias: this.section }, 
        fields: {
            userid: { type: "STRING", key: true },
            checkreservepwd: { type: "STRING" },
            checkpersonal: { type: "STRING" },
            checkmatchpattern: { type: "STRING" },
            checkmatchnumber: { type: "STRING" },
            timenotusedoldpwd: { type: "INTEGER" },
            alertbeforeexpire: { type: "INTEGER" },
            pwdexpireday: { type: "INTEGER" },
            notloginafterday: { type: "INTEGER" },
            notchgpwduntilday: { type: "INTEGER" },
            minpwdlength: { type: "INTEGER" },
            alphainpwd: { type: "INTEGER" },
            otherinpwd: { type: "INTEGER" },
            maxsamechar: { type: "INTEGER" },
            mindiffchar: { type: "INTEGER" },
            maxarrangechar: { type: "INTEGER" },
            loginfailtime: { type: "INTEGER" },
            fromip: { type: "STRING" },
            toip: { type: "STRING" },
            starttime: { type: "TIME" },
            endtime: { type: "TIME" },
            groupflag: { type: "STRING" },
            maxloginfailtime: { type: "INTEGER" },
            checkdictpwd: { type: "INTEGER" },
            maxpwdlength: { type: "INTEGER" },
            digitinpwd: { type: "INTEGER" },
            upperinpwd: { type: "INTEGER" },
            lowerinpwd: { type: "INTEGER" },
        },
    };

    /* try to validate fields for insert, update, delete, retrieve */
    protected override validateRequireFields(context: KnContextInfo, model: KnModel, action: string) : Promise<KnValidateInfo> {
        let vi = this.validateParameters(context.params,"userid");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        return Promise.resolve(vi);
    }

    protected override async doRetrieving(context: KnContextInfo, model: KnModel, action: string = KnOperation.RETRIEVE): Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.performRetrieving(context, db);
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

    public async performRetrieving(context: KnContextInfo, db: KnDBConnector): Promise<KnRecordSet> {
        return this.performRetrievePolicy(db, context.params.userid, context);
    }

    public async performRetrievePolicy(db: KnDBConnector, userid: string = "DEFAULT", context?: any): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("select * from tppwd ");
        knsql.append("where userid = ?userid ");
        knsql.set("userid",userid);
        let rs = await knsql.executeQuery(db, context);
        return this.createRecordSet(rs);
    }

    public override async doInsert(context: KnContextInfo, model: KnModel) : Promise<any> {
        return super.doInsert(context, model);
    }

    public override async doUpdate(context: KnContextInfo, model: KnModel) : Promise<any> {
        return super.doUpdate(context, model);
    }

}
