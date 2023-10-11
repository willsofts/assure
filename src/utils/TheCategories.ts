import { KnDataMapEntitySetting } from "@willsofts/will-core";
import { KnCategorySetting } from "@willsofts/will-serv";

export class TheCategories {
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

        trxstatus: {tableName: "trxstatus", keyField: "statusid", addonFields: "seqno", orderFields: "seqno", setting: { keyName: "statusid", valueNames: ["nameen"]} },
    };

    public static getSetting(name: string) : KnDataMapEntitySetting | undefined {
        return this.categories[name];
    }
    
}