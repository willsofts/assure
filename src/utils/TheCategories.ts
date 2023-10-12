import { KnDataMapEntitySetting } from "../models/KnCoreAlias";
import { KnCategorySetting } from "../models/KnServAlias";

export class TheCategories {
    public static readonly categories : KnCategorySetting = {
        tklanguage: {tableName: "tklanguage", keyField: "langcode", setting: { keyName: "langcode", valueNames: ["nameen"]} },
        tkactive : {tableName: "tkactive", keyField: "activeid", addonFields: "seqno", orderFields: "seqno", setting: { keyName: "activeid", valueNames: ["nameen"]} },
        tkappstype : {tableName: "tkappstype", keyField: "appstype", addonFields: "seqno", orderFields: "seqno", setting: { keyName: "appstype", valueNames: ["nameen"]} },
        tkprogtype : {tableName: "tkprogtype", keyField: "progtype", addonFields: "seqno", orderFields: "seqno", setting: { keyName: "progtype", valueNames: ["nameen"]} },    
        tksystemtype : {tableName: "tksystemtype", keyField: "systemtype", addonFields: "seqno", orderFields: "seqno", setting: { keyName: "systemtype", valueNames: ["nameen"]} },
        tkgroupmobile : {tableName: "tkgroupmobile", keyField: "groupname", orderFields: "groupname", setting: { keyName: "groupname", valueNames: ["nameen"]} },
        tkusertype : {tableName: "tkusertype", keyField: "usertype", orderFields: "usertype", setting: { keyName: "usertype", valueNames: ["nameen"]} },
        tkpermit : {tableName: "tkpermit", keyField: "permname", addonFields: "seqno", orderFields: "seqno", setting: { keyName: "permname", valueNames: ["nameen"]} },
        tkuserstatus : {tableName: "tkuserstatus", keyField: "userstatus", addonFields: "seqno", orderFields: "seqno", setting: { keyName: "userstatus", valueNames: ["nameen"]} },
        tkrxstatus: {tableName: "tkrxstatus", keyField: "statusid", addonFields: "seqno", orderFields: "seqno", setting: { keyName: "statusid", valueNames: ["nameen"]} },
        tkvisible: {tableName: "tkvisible", keyField: "visibleid", addonFields: "seqno", orderFields: "seqno", setting: { keyName: "visibleid", valueNames: ["nameen"]} },
        tkbranchtype : {tableName: "tkbranchtype", keyField: "branchtype", addonFields: "seqno", orderFields: "seqno", setting: { keyName: "branchtype", valueNames: ["nameen"]} },

        tprod : {tableName: "tprod", keyField: "product", addonFields: "seqno", orderFields: "seqno", setting: { keyName: "product", valueNames: ["nameen"]} },
        tprog : {tableName: "tprog", keyField: "programid", orderFields: "programid", captionFields: "progname,prognameth", nameen: "progname", nameth: "prognameth", setting: { keyName: "programid", valueNames: ["progname"]} },        
        tcompbranch: {tableName: "tcompbranch", keyField: "branch", checkActive: true, checkSite: true, setting: { keyName: "branch", valueNames: ["nameen"]} },
        trole : {tableName: "trole", keyField: "roleid", checkActive: true, checkSite: true, setting: { keyName: "roleid", valueNames: ["nameen"]} },
        tgroup : {tableName: "tgroup", keyField: "groupname", addonFilters: "(privateflag is null or privateflag != '1')", setting: { keyName: "groupname", valueNames: ["nameen"]} },
        ttemplatetag: {tableName: "ttemplatetag", keyField: "tagname", addonFields: "seqno", orderFields: "seqno", captionFields: "tagtitle", nameen: "tagtitle", nameth: "tagtitle", setting: { keyName: "tagname", valueNames: ["tagtitle"]} },

    };

    public static getSetting(name: string) : KnDataMapEntitySetting | undefined {
        return this.categories[name];
    }
    
}