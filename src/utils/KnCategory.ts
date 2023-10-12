import { UserTokenInfo } from "@willsofts/will-lib";
import { HTTP } from "@willsofts/will-api";
import { KnContextInfo, KnDataMapEntitySetting } from "../models/KnCoreAlias";
import { VerifyError } from "../models/VerifyError";
import { KnUtility } from "../utils/KnUtility";
import { KnCategorySetting } from "../models/KnServAlias";

export class KnCategory {

    public static getSetting(context: KnContextInfo, getter: Function | KnCategorySetting, userToken?: UserTokenInfo, ...names: string[]) : KnDataMapEntitySetting[] {
        let result : KnDataMapEntitySetting[] = [];
        let eng = KnUtility.isEnglish(context);
        for(let name of names) {
            let setting = undefined;
            if(typeof getter === "function") {
                setting = getter.call(this,name);
            } else {
                setting = getter[name];
            }
            if(setting) {
                let nameen = setting.nameen?setting.nameen:"nameen";
                let nameth = setting.nameth?setting.nameth:"nameth";
                let valuename = eng?nameen:nameth;
                if(setting.checkSite) {
                    setting.addonFilters = "site = '"+userToken?.site+"'";
                }
                if(!setting.orderFields) {
                    setting.orderFields = valuename;
                }
                if(setting.setting?.valueNames.length==1) {
                    setting.setting.valueNames = [valuename];
                }
                result.push(setting);
            } else {
                throw new VerifyError("Setting not found ("+name+")",HTTP.NOT_ACCEPTABLE,-16062);
            }
        }
        return result;
    }

}