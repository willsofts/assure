import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { DB_SECTION } from "../utils/EnvironmentVariable";

const ConfigService : ServiceSchema = {
    name: "config",
    mixins: [KnService],
    model: {
        name: "tconfig",
        alias: { privateAlias: DB_SECTION },
    },
    settings: {
        disableColumnSchema: true, //do not return column schema
    }
}
export = ConfigService;
