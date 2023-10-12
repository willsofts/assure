import { KnModel } from "@willsofts/will-db";
import { Utilities } from '@willsofts/will-util';
import { KnLabelConfig } from "../utils/KnLabelConfig";
import { KnUtility } from "../utils/KnUtility";
import { KnDataTable } from "../models/KnCoreAlias";
import { TknChangePasswordHandler } from "./TknChangePasswordHandler";
import util from 'util';

export class TknPasswordPolicyHandler extends TknChangePasswordHandler {

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
