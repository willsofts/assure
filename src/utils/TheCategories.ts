import { KnDataMapEntitySetting } from "../models/KnCoreAlias";
import { KnCategorySetting } from "../models/KnServAlias";

export class TheCategories {
    public static readonly categories : KnCategorySetting = {
        tklanguage: {tableName: "tconstant", addonFilters: "typename='tlanguage'", keyField: "typeid", addonFields: "seqno", orderFields: "seqno", setting: { categoryName: "tklanguage", keyName: "typeid", valueNames: ["nameen"]} },
        tkactive : {tableName: "tconstant", addonFilters: "typename='tactive'", keyField: "typeid", addonFields: "seqno", orderFields: "seqno", setting: { categoryName: "tkactive", keyName: "typeid", valueNames: ["nameen"]} },
        tkappstype : {tableName: "tconstant", addonFilters: "typename='tappstype'", keyField: "typeid", addonFields: "seqno", orderFields: "seqno", setting: { categoryName: "tkappstype", keyName: "typeid", valueNames: ["nameen"]} },
        tkprogtype : {tableName: "tconstant", addonFilters: "typename='tprogtype'", keyField: "typeid", addonFields: "seqno", orderFields: "seqno", setting: { categoryName: "tkprogtype", keyName: "typeid", valueNames: ["nameen"]} },    
        tksystemtype : {tableName: "tconstant", addonFilters: "typename='tsystemtype'", keyField: "typeid", addonFields: "seqno", orderFields: "seqno", setting: { categoryName: "tksystemtype", keyName: "typeid", valueNames: ["nameen"]} },
        tkgroupmobile : {tableName: "tconstant", addonFilters: "typename='tgroupmobile'", keyField: "typeid", addonFields: "seqno", orderFields: "seqno", setting: { categoryName: "tkgroupmobile", keyName: "typeid", valueNames: ["nameen"]} },
        tkusertype : {tableName: "tconstant", addonFilters: "typename='tusertype'", keyField: "typeid", addonFields: "seqno", orderFields: "seqno", setting: { categoryName: "tkusertype", keyName: "typeid", valueNames: ["nameen"]} },
        tkpermit : {tableName: "tconstant", addonFilters: "typename='tpermit'", keyField: "typeid", addonFields: "seqno", orderFields: "seqno", setting: { categoryName: "tkpermit", keyName: "typeid", valueNames: ["nameen"]} },
        tkuserstatus : {tableName: "tconstant", addonFilters: "typename='tuserstatus'", keyField: "typeid", addonFields: "seqno", orderFields: "seqno", setting: { categoryName: "tkuserstatus", keyName: "typeid", valueNames: ["nameen"]} },
        tkrxstatus: {tableName: "tconstant", addonFilters: "typename='trxstatus'", keyField: "typeid", addonFields: "seqno", orderFields: "seqno", setting: { categoryName: "tkrxstatus", keyName: "typeid", valueNames: ["nameen"]} },
        tkvisible: {tableName: "tconstant", addonFilters: "typename='tvisible'", keyField: "typeid", addonFields: "seqno", orderFields: "seqno", setting: { categoryName: "tkvisible", keyName: "typeid", valueNames: ["nameen"]} },
        tkbranchtype : {tableName: "tconstant", addonFilters: "typename='tbranchtype'", keyField: "typeid", addonFields: "seqno", orderFields: "seqno", setting: { categoryName: "tkbranchtype", keyName: "typeid", valueNames: ["nameen"]} },

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