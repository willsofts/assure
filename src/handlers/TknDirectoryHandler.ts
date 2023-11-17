import { KnModel, KnSetting } from "@willsofts/will-db";
import { HTTP } from "@willsofts/will-api";
import { KnDBConnector, KnSQL, KnResultSet, KnRecordSet, KnSQLInterface } from "@willsofts/will-sql";
import { KnContextInfo } from "../models/KnCoreAlias";
import { VerifyError } from "../models/VerifyError";
import { TknSchemeHandler } from "./TknSchemeHandler";

export class TknDirectoryHandler extends TknSchemeHandler {
    public model : KnModel = { name: "tdirectory", alias: { privateAlias: this.section } };
    public settings: KnSetting = { 
        ...super.settings, 
        disableColumnSchema: true, //do not return column schema
        disablePageOffset: true, //do not return offsets
        disableQueryPaging: true, //do not paging            
    }
    public handlers = [ {name: "get"} ];

    protected override buildFilterQuery(context: KnContextInfo, model: KnModel, knsql: KnSQLInterface, selector: string, action?: string, subaction?: string): KnSQLInterface {
        let params = context.params;
        knsql.append(selector);
        knsql.append(" from ");
        knsql.append(model.name);
        knsql.append(" where inactive='0' and invisible='0' "); 
        let systemtype = params.systemtype && params.systemtype!="" ? params.systemtype : "W";
        knsql.append("and systemtype = ?systemtype");
        knsql.set("systemtype",systemtype);
        return knsql;    
    }

    public override async doGet(context: KnContextInfo, model: KnModel = this.model) : Promise<KnRecordSet> {
		this.logger.debug(this.constructor.name+".doGet: params",context.params);
        let vi = this.validateParameters(context.params,"domainid");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
		let domainid = context.params.domainid;
		let db = this.getPrivateConnector(model);
		try {
			let rs = await this.getDirectoryInfo(db,domainid,context);
			return await this.createCipherData(context, "get", this.createRecordSet(rs));
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
		}
	}

	public async getDirectoryInfo(db: KnDBConnector, domainid: string, context?: any) : Promise<KnResultSet> {
        let sql = new KnSQL();
        sql.append("select * from tdirectory where domainid = ?domainid and inactive='0' and systemtype='W' ");
        sql.set("domainid",domainid);
        let rs = await sql.executeQuery(db, context);
		this.logger.debug(this.constructor.name+".getDirectoryInfo","effected "+rs.rows.length+" rows.");
		return Promise.resolve(rs);
	}

    public override async doList(context: KnContextInfo, model: KnModel = this.model) : Promise<KnRecordSet> {
        return this.doFind(context, model);
    }

    public override async doFind(context: KnContextInfo, model: KnModel = this.model) : Promise<KnRecordSet> {
        return this.doCollect(context, model);
    }

    public override async doCollect(context: KnContextInfo, model: KnModel = this.model) : Promise<KnRecordSet> {
        let rs = await this.doFinding(context, model);
        return Promise.resolve(this.createRecordSet(rs));
    }
    
}
