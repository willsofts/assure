import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknLoggingHandler } from "../handlers/TknLoggingHandler";

const LoggingService : ServiceSchema = {
    name: "logging",
    mixins: [KnService],
    handler: new TknLoggingHandler(), 
}
export = LoggingService;
