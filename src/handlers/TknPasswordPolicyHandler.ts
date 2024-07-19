import { KnModel } from "@willsofts/will-db";
import { Utilities } from '@willsofts/will-util';
import { KnLabelConfig } from "../utils/KnLabelConfig";
import { KnUtility } from "../utils/KnUtility";
import { KnDataTable } from "../models/KnCoreAlias";
import { TknChangePasswordHandler } from "./TknChangePasswordHandler";
import { KnContextInfo, KnDataSet } from '../models/KnCoreAlias';
import util from 'util';

export class TknPasswordPolicyHandler extends TknChangePasswordHandler {

    public handlers = [ {name: "policy"}, {name: "policies"}, {name: "categories"} ];

    public async categories(context: KnContextInfo) : Promise<KnDataTable> {
        return this.callFunctional(context, {operate: "categories", raw: false}, this.doCategories);
    }

    protected async doCategories(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let policy = await this.doPolicies(context, model);
        let workdir = Utilities.getWorkingDir(process.cwd()); 
        this.logger.debug(this.constructor.name+".doCategories: workdir="+workdir);
        let label = new KnLabelConfig("password_policy", KnUtility.getDefaultLanguage(context));
        await label.load(workdir);
        let ds : KnDataSet = {};
        for(let lang in label.label) {
            let policies : string[] = [];
            for(let p of policy) {
                let text = util.format(label.get(p.code,p.text,lang),...p.args);
                policies.push(text);
            }
            ds[lang] = policies;
        }
        let data = { action: "categories", entity: {}, dataset: ds };
        return await this.createCipherData(context, "categories", data);
    }

    protected override async doExecute(context: any, model: KnModel): Promise<KnDataTable> {
        let policy = await this.doPolicies(context, model);
        let workdir = Utilities.getWorkingDir(process.cwd()); 
        this.logger.debug(this.constructor.name+".doExecute: workdir="+workdir);
        let label = new KnLabelConfig("password_policy", KnUtility.getDefaultLanguage(context));
        await label.load(workdir);
        let policies : string[] = [];
        for(let p of policy) {
            let text = util.format(label.get(p.code,p.text),...p.args);
            policies.push(text);
        }         
        let data = { action: "execute", entity: {}, dataset: { policy: policies } };
        return await this.createCipherData(context, "execute", data);
    }

}
