import { KnModel } from "@willsofts/will-db";
import { HTTP } from "@willsofts/will-api";
import { Utilities } from "@willsofts/will-util";
import { TknSchemeHandler } from "./TknSchemeHandler";
import { VerifyError } from "../models/VerifyError";
import { KnLabelUtility } from "../utils/KnLabelUtility";
import { KnContextInfo, KnValidateInfo, KnLabelData, KnDataEntity } from '../models/KnCoreAlias';

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

}