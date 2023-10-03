import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { KnUtility, KnDataMapRecordSetting } from "@willsofts/will-core";
import { DB_SECTION } from "../utils/EnvironmentVariable";

const StyleService : ServiceSchema = {
    name: "style",
    mixins: [KnService],
    model: {
        name: "tstyle",
        alias: { privateAlias: DB_SECTION },
    },
    settings: {
        disableColumnSchema: true, //do not return column schema
        disableQueryPaging: true, //do not paging
    },
    actions: {
        async category() {
            let sql = "select * from tstyle order by 1 ";
            let rs = await this.handler.executeQuery(sql);    
            let setting : KnDataMapRecordSetting = {tablename: "tstyle", resultset: rs, setting: {keyName: "styleid", valueNames: ["styletext"], categoryName: "stylecategory"}};
            return KnUtility.createDataEntity([setting]);
        },
    }    
}
export = StyleService;
