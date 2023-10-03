import { KnContextInfo, VerifyError, KnDataMapEntitySetting, KnUtility } from "@willsofts/will-core";
import { UserTokenInfo } from "@willsofts/will-lib";
import { HTTP } from "@willsofts/will-api";
import { KnCategorySetting } from "../models/EnsureAlias";

export class KnCategory {
    public static readonly categories : KnCategorySetting = {
        tlanguage: {tableName: "tlanguage", keyField: "langcode", setting: { keyName: "langcode", valueNames: ["nameen"]} },
        tactive : {tableName: "tactive", keyField: "activeid", addonFields: "seqno", orderFields: "seqno", setting: { keyName: "activeid", valueNames: ["nameen"]} },

        tprod : {tableName: "tprod", keyField: "product", addonFields: "seqno", orderFields: "seqno", setting: { keyName: "product", valueNames: ["nameen"]} },
        tappstype : {tableName: "tappstype", keyField: "appstype", addonFields: "seqno", orderFields: "seqno", setting: { keyName: "appstype", valueNames: ["nameen"]} },
        tprogtype : {tableName: "tprogtype", keyField: "progtype", addonFields: "seqno", orderFields: "seqno", setting: { keyName: "progtype", valueNames: ["nameen"]} },    
        tsystemtype : {tableName: "tsystemtype", keyField: "systemtype", addonFields: "seqno", orderFields: "seqno", setting: { keyName: "systemtype", valueNames: ["nameen"]} },

        tgroupmobile : {tableName: "tgroupmobile", keyField: "groupname", orderFields: "groupname", setting: { keyName: "groupname", valueNames: ["nameen"]} },
        tusertype : {tableName: "tusertype", keyField: "usertype", orderFields: "usertype", setting: { keyName: "usertype", valueNames: ["nameen"]} },
        tprog : {tableName: "tprog", keyField: "programid", orderFields: "programid", captionFields: "progname,prognameth", nameen: "progname", nameth: "prognameth", setting: { keyName: "programid", valueNames: ["progname"]} },
        tpermit : {tableName: "tpermit", keyField: "permname", addonFields: "seqno", orderFields: "seqno", setting: { keyName: "permname", valueNames: ["nameen"]} },
        
        tcompbranch: {tableName: "tcompbranch", keyField: "branch", checkActive: true, checkSite: true, setting: { keyName: "branch", valueNames: ["nameen"]} },
        tuserstatus : {tableName: "tuserstatus", keyField: "userstatus", addonFields: "seqno", orderFields: "seqno", setting: { keyName: "userstatus", valueNames: ["nameen"]} },
        trole : {tableName: "trole", keyField: "roleid", checkActive: true, checkSite: true, setting: { keyName: "roleid", valueNames: ["nameen"]} },
        tgroup : {tableName: "tgroup", keyField: "groupname", addonFilters: "(privateflag is null or privateflag != '1')", setting: { keyName: "groupname", valueNames: ["nameen"]} },

        ttemplatetag: {tableName: "ttemplatetag", keyField: "tagname", addonFields: "seqno", orderFields: "seqno", captionFields: "tagtitle", nameen: "tagtitle", nameth: "tagtitle", setting: { keyName: "tagname", valueNames: ["tagtitle"]} },
    };

    public static getSetting(context: KnContextInfo, userToken?: UserTokenInfo, ...names: string[]) : KnDataMapEntitySetting[] {
        let result : KnDataMapEntitySetting[] = [];
        let eng = KnUtility.isEnglish(context);
        for(let name of names) {
            let setting = this.categories[name];
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