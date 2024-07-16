import { KnModel } from "@willsofts/will-db";
import { KnDBConnector, KnSQL, KnRecordSet } from '@willsofts/will-sql';
import { HTTP } from "@willsofts/will-api";
import { VerifyError } from "../models/VerifyError";
import { TknSchemeHandler } from "./TknSchemeHandler";
import { KnContextInfo, KnDataEntity } from "../models/KnCoreAlias";
import { KnDataTableSetting, KnDataTableResultSet, KnDataMapEntitySetting, KnDataMapRecordSetting, KnDataMapSetting } from "../models/KnCoreAlias";
import { KnUtility } from "../utils/KnUtility";

export class TknDataTableHandler extends TknSchemeHandler {
    public model : KnModel = { name: "tconfig", alias: { privateAlias: this.section } };
    public handlers = [ {name: "get"}, {name: "category"}, {name: "config"}, {name: "configlist"} ];

    protected override async doGet(context: KnContextInfo, model: KnModel) : Promise<KnDataTableResultSet> {
        let vi = this.validateParameters(context.params,"tablename","keyfield");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        return this.getDataSet(context, model);
	}

    protected async getDataSet(context: KnContextInfo, model: KnModel) : Promise<KnDataTableResultSet> {
		let tablename = context.params.tablename;
		let keyfield = context.params.keyfield;
        let orderfield = context.params.orderfield;
		this.logger.info(this.constructor.name+".getDataSet : tablename="+tablename+", keyfield="+keyfield+", orderfield="+orderfield);
		let db = this.getPrivateConnector(model);
		try {
			let rs = await this.getDataTable(db,[{tableName: tablename, keyField: keyfield, orderFields: orderfield}], true, context);
			if(rs && rs.length>0) {
                return await this.createCipherData(context, "get", rs[0]);
            }
            let data = {tablename: tablename, resultset: this.createRecordSet() };
            return await this.createCipherData(context, "get", data);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
		}
    }

    protected buildDataTableQuery(knsql: KnSQL, datasetting: KnDataTableSetting) {
        let captionFields = datasetting.captionFields || "nameen,nameth";
        knsql.clear();
        knsql.append("select ");
        if(datasetting.keyField && datasetting.keyField.trim().length>0) {
            knsql.append(datasetting.keyField);
            knsql.append(",").append(captionFields);
            if(datasetting.addonFields) {
                knsql.append(",").append(datasetting.addonFields);
            }
        } else {
            knsql.append(" *");
        }
        knsql.append(" from ").append(datasetting.tableName);
        let filter = " where";
        if(datasetting.checkActive) {
            knsql.append(filter).append(" (inactive is null or inactive != '1') ");
            filter = " and";
        }
        if(datasetting.addonFilters) {
            knsql.append(filter).append(" ").append(datasetting.addonFilters);
        }
        if(datasetting.orderFields) {
            knsql.append(" order by ").append(datasetting.orderFields);
        } else {
            knsql.append(" order by ").append(captionFields);
        }
    }

    public async fetchDataTable(db: KnDBConnector, setting: KnDataTableSetting, disableColumnSchema: boolean = true, context?: any) : Promise<KnDataTableResultSet> {
        let knsql = new KnSQL();
        this.buildDataTableQuery(knsql, setting);
        this.logger.info(this.constructor.name,knsql);
        let rs = await knsql.executeQuery(db,context);
        if(disableColumnSchema) {
            delete rs.columns;
        }
        let category = (setting as any).setting?.categoryName ? (setting as any).setting?.categoryName : setting.tableName;
        return {tablename: setting.tableName, category: category, resultset: rs};    
    }

    /**
     * To get data table as array
     * @param db connection
     * @param datasettings 
     * @param disableColumnSchema 
     * @returns 
     */
    public async getDataTable(db: KnDBConnector, datasettings: KnDataTableSetting[], disableColumnSchema: boolean = true, context?: any) : Promise<KnDataTableResultSet[]> {
        let rss = [];
        for(let dts of datasettings) {
            rss.push(this.fetchDataTable(db, dts, disableColumnSchema, context));
        }
        return await Promise.all(rss);
        /*        
        let result = new Array<KnDataTableResultSet>();
        for(let dts of datasettings) {
            let rs = await this.fetchDataTable(db, dts, disableColumnSchema, context);
			result.push(rs);
        }
        return Promise.resolve(result);
        */
    }

    public async fetchDataCategory(db: KnDBConnector, setting: KnDataMapEntitySetting, disableColumnSchema: boolean = true, context?: any) : Promise<[KnDataTableResultSet,KnDataMapEntitySetting]> {
        let knsql = new KnSQL();
        this.buildDataTableQuery(knsql, setting);
        this.logger.info(this.constructor.name,knsql);
        let rs = await knsql.executeQuery(db,context);
        if(disableColumnSchema) {
            delete rs.columns;
        }
        return [{tablename: setting.tableName, resultset: rs},setting];    
    }

    /**
     * To get data table as map 
     * @param db connection
     * @param datasettings 
     * @param disableColumnSchema 
     * @returns 
     */
    public async getDataCategory(db: KnDBConnector, datasettings: KnDataMapEntitySetting[], disableColumnSchema: boolean = true, context?: any) : Promise<KnDataEntity> {
        let result : KnDataEntity = { };
        let rss = [];
        for(let dts of datasettings) {
            if(dts.setting) {
                rss.push(this.fetchDataCategory(db, dts, disableColumnSchema, context));
            }
        }
        let results = await Promise.all(rss);
        for(let [rs,dts] of results) {
            //result = Object.assign(result, rs);
            let setting : KnDataMapRecordSetting = {tablename: rs.tablename, resultset: rs.resultset, setting: dts.setting as KnDataMapSetting};
            let map = KnUtility.createDataEntity([setting]);
            result = Object.assign(result, map);
        }
        /*
        for(let dts of datasettings) {
            if(dts.setting) {
                let rs = await this.fetchDataTable(db, dts, disableColumnSchema, context);
                let setting : DataMapKnRecordSetting = {tablename: rs.tablename, resultset: rs.resultset, setting: dts.setting};
                let map = KnUtility.createKnDataEntity([setting]);
                result = Object.assign(result, map);
            }
        }
        */
        return Promise.resolve(result);
    }

    protected override async doList(context: any, model: KnModel) : Promise<KnDataTableResultSet[]> {
        let orderfield = context.params.orderfield;        
        let tablenames = this.getParameterArray("tablename",context.params);
		this.logger.info(this.constructor.name+".doList : tablename="+tablenames+", orderfield="+orderfield);
        if(!tablenames) return Promise.reject(new VerifyError("Parameter not found (tablename)",HTTP.NOT_ACCEPTABLE,-16061));
		let db = this.getPrivateConnector(model);
		try {
            let settings = tablenames.map((tablename: string) => { return {tableName: tablename, keyField: "", orderFields: orderfield}; });
            this.logger.debug(this.constructor.name+".doList : settings",settings);
			let rs = await this.getDataTable(db,settings, true, context);
			if(rs && rs.length>0) {
                return await this.createCipherData(context, "list", rs);
            }
            let data = tablenames.map((tablename: string) => { return {tablename: tablename, resultset: this.createRecordSet() }; });
            return await this.createCipherData(context, "list", data);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
		}        
    }

    protected override async doFind(context: any, model: KnModel) : Promise<KnRecordSet> {
        let rs = await this.doFinding(context, model)
        return Promise.resolve(this.createRecordSet(rs));
    }

    public async category(context: KnContextInfo) : Promise<KnDataEntity> {
        return this.callFunctional(context, {operate: "category", raw: false}, this.doCategory);
    }

    protected async doCategory(context: KnContextInfo, model: KnModel) : Promise<KnDataEntity> {
        let vi = this.validateParameters(context.params,"tablename","keyfield","valuefield");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        let rs = await this.getDataSet(context, model);
        let valuefield = context.params.valuefield;
        let keyfield = context.params.keyfield;
        let data = KnUtility.createDataEntity([{tablename: rs.tablename, resultset: rs.resultset, setting: {keyName: keyfield, valueNames: [valuefield]}}]);
        return await this.createCipherData(context, "category", data);
	}

    public async config(context: KnContextInfo) : Promise<KnRecordSet> {
        return this.callFunctional(context, {operate: "config", raw: false}, this.doConfig);
    }

    public async configlist(context: KnContextInfo) : Promise<KnRecordSet> {
        return this.callFunctional(context, {operate: "configlist", raw: false}, this.doConfigList);
    }

    protected async doConfig(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        let vi = this.validateParameters(context.params,"category");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        let rs = await this.doFinding(context, model);
        return await this.createCipherData(context, "config", this.createRecordSet(rs));
	}

    protected async doConfigList(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        let rs = await this.doFinding(context, model);
        return await this.createCipherData(context, "configlist", this.createRecordSet(rs));
	}

}
