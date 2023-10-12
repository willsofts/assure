import { KnModel, KnOperation } from "@willsofts/will-db";
import { HTTP } from "@willsofts/will-api";
import { KnSQL, KnRecordSet, KnDBConnector } from '@willsofts/will-sql';
import { VerifyError } from "../models/VerifyError";
import { KnContextInfo, KnDataTable } from '../models/KnCoreAlias';
import { TknSchemeHandler } from "./TknSchemeHandler";

export class TknProgramHandler extends TknSchemeHandler {
    public model : KnModel = { name: "tprog", alias: { privateAlias: this.section } };
    public handlers = [ {name: "get"} ];

    protected async doGet(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        return this.doRetrieve(context, model);
    }

    protected override async doRetrieve(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        let vi = this.validateParameters(context.params,"program");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.performRetrieving(context, db);
            return await this.createCipherData(context, KnOperation.RETRIEVE, rs);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    public async performRetrieving(context: KnContextInfo, db: KnDBConnector): Promise<KnRecordSet> {
        let knsql = new KnSQL();
        knsql.append("select tprog.programid,tprog.progname,tprog.prognameth,tprog.iconfile,");
        knsql.append("tprog.shortname,tprog.parameters,tprog.progpath,tprog.progtype,");
        knsql.append("tprog.progsystem,tprog.shortname,tprog.shortnameth,");
        knsql.append("tprod.url,tprod.verified,tprod.centerflag,tprod.startdate,"); 
        knsql.append("tprod.serialid,tprod.nameen,tprod.nameth ");
        knsql.append("from tprog ");
        knsql.append("left join tprod ON tprod.product = tprog.product "); 
        knsql.append("where tprog.programid = ?programid ");
        knsql.set("programid",context.params.program);
        let rs = await knsql.executeQuery(db,context);
        return this.createRecordSet(rs);
    }

    public async getDataSource(context: KnContextInfo) : Promise<KnDataTable | undefined> {
        let vi = this.validateParameters(context.params,"program");
        if(!vi.valid) {
            return undefined;
        }
        let db = this.getPrivateConnector(this.model);
        try {
            let rs = await this.performRetrieving(context, db);
            if(rs && rs.rows.length>0) {
                let row = rs.rows[0];
                return {action: "retrieve", entity: {}, dataset: row};
            }
            return undefined;
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

}
