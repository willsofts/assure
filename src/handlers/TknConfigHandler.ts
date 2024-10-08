import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnSQL, KnRecordSet } from '@willsofts/will-sql';
import { HTTP } from "@willsofts/will-api";
import { VerifyError } from "../models/VerifyError";
import { KnContextInfo, KnValidateInfo, KnDataSet } from "../models/KnCoreAlias";
import { TknSchemeHandler } from "./TknSchemeHandler";

export class TknConfigHandler extends TknSchemeHandler {
    public model : KnModel = { name: "tconfig", alias: { privateAlias: this.section } };
    public handlers = [ {name: "get"}, {name: "list"}  ];

    public validateRequireFields(context: KnContextInfo, model: KnModel, action?: string) : Promise<KnValidateInfo> {
        let vi = this.validateParameters(context.params,"category");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        return Promise.resolve(vi);
    }

    protected async doGet(context: KnContextInfo, model: KnModel) : Promise<KnDataSet> {
        await this.validateRequireFields(context, model, KnOperation.RETRIEVE);
        let rs = await this.doRetrieving(context, model, KnOperation.RETRIEVE);
        let ds : KnDataSet = {};
        if(rs && rs.rows.length > 0) {
            rs.rows.forEach((item:any) => {                 
                let cat = ds[item.category];
                if(!cat) {
                    cat = {};
                    ds[item.category] = cat;
                }
                cat[item.colname] = item.colvalue;
             });
        }
        return Promise.resolve(ds);
    }

    protected override async doList(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        let rs = await super.doFinding(context,model);
        return this.createRecordSet(rs);
    }

    protected async doRetrieving(context: KnContextInfo, model: KnModel, action: string = KnOperation.RETRIEVE): Promise<KnRecordSet> {
        let db = this.getPrivateConnector(model);
        try {
            return await this.performRetrieving(db, this.getParameterArray('category',context.params), context);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    public async performRetrieving(db: KnDBConnector, category: string|string[]|undefined, context?: any): Promise<KnRecordSet> {
        if(typeof category === 'string') category = [category];
        if(!category || category.length==0) return this.createRecordSet();
        let knsql = new KnSQL();
        knsql.append("select * from tconfig ");
        if(category.length > 1) {
            let ids = category.map((item:string) => "'"+item+"'").join(",");
            knsql.append("where category IN (").append(ids).append(") ");
        } else {
            knsql.append("where category = ?category ");
            knsql.set("category",category[0]);
        }
        this.logger.debug(this.constructor.name+".performRetrieving",knsql);
        let rs = await knsql.executeQuery(db,context);
        return this.createRecordSet(rs);
    }

}
