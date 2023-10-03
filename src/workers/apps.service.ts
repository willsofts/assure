import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { DB_SECTION } from "../utils/EnvironmentVariable";

const AppsService : ServiceSchema = {
    name: "apps",
    mixins: [KnService],
    model: {
        name: "tprog",
        alias: { privateAlias: DB_SECTION },
    },
    settings: {
        disableColumnSchema: true, //do not return column schema
    }
}
export = AppsService;
