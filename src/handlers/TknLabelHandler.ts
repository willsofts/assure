import { KnModel } from "@willsofts/will-db";
import { KnRecordSet, KnResultSet } from "@willsofts/will-sql";
import { HTTP } from "@willsofts/will-api";
import { Utilities } from "@willsofts/will-util";
import { TknSchemeHandler } from "./TknSchemeHandler";
import { VerifyError } from "../models/VerifyError";
import { KnLabelUtility } from "../utils/KnLabelUtility";
import { KnContextInfo, KnValidateInfo, KnLabelData, KnDataEntity, KnDataSet } from '../models/KnCoreAlias';

export class TknLabelHandler extends TknSchemeHandler {
    public model : KnModel = { name: "tlabel", alias: { privateAlias: this.section } };
    public handlers = [ {name: "get"} ];
    
    protected validateRequireFields(context: any, model: KnModel, action: string) : Promise<KnValidateInfo> {
        let vi = this.validateParameters(context.params,"labelname");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        return Promise.resolve(vi);
    }

    protected override async doGet(context: KnContextInfo, model: KnModel) : Promise<KnDataEntity> {
        await this.validateRequireFields(context, model, "get");
        let workdir = Utilities.getWorkingDir(process.cwd());
        this.logger.debug(this.constructor.name+".doGet: curdir="+process.cwd()+", workdir="+workdir);
        let util = new KnLabelUtility(context.params.labelname);
        let data = await util.loadAndBuild(workdir);
        return this.createCipherData(context, "get", data);
	}

    protected override async doList(context: any, model: KnModel) : Promise<KnLabelData[]> {
        await this.validateRequireFields(context, model, "list");
        let workdir = Utilities.getWorkingDir(process.cwd());
        this.logger.debug(this.constructor.name+".doList: curdir="+process.cwd()+", workdir="+workdir);
        let util = new KnLabelUtility(context.params.labelname);
        let data = await util.load(workdir);
        return this.createCipherData(context, "list", data);
    }

    protected buildLabelData(rs: KnResultSet) : Map<string,KnLabelData> {
        let maps = new Map<string,KnLabelData>();
        if(rs && rs.rows?.length > 0) {
            for(let row of rs.rows) {
                let lang = row.langcode;
                let name = row.labelname;
                let value = row.labelvalue;
                let data = maps.get(lang);
                if(!data) {
                    data = { language: lang, label: [] };
                    maps.set(lang,data);
                }
                data.label.push({name: name, value: value});
            }
        }
        return maps;
    }

    protected override async doCollect(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        let rs = await this.doFinding(context,model);
        return this.createCipherData(context, "collect", this.createRecordSet(rs));
    }

    protected override async doFind(context: KnContextInfo, model: KnModel) : Promise<KnLabelData[]> {
        let rs = await this.doFinding(context,model);
        let labels : KnLabelData[] = [];
        let maps = this.buildLabelData(rs);
        for(let [key, value] of maps) {
            labels.push(value);
        }
        return this.createCipherData(context, "find", labels);
    }

    protected override async doRetrieve(context: KnContextInfo, model: KnModel) : Promise<KnDataEntity> {
        let rs = await this.doFinding(context,model);
        let labels : KnDataEntity = {};
        let maps = this.buildLabelData(rs);
        for(let [key, value] of maps) {
            let data : KnDataSet = {};
            for(let item of value.label) { data[item.name] = item.value };
            labels[key] = data;
        }
        return this.createCipherData(context, "retrieve", labels);
    }

}