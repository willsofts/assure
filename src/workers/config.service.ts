import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknConfigHandler } from "../handlers/TknConfigHandler";

const ConfigService : ServiceSchema = {
    name: "config",
    mixins: [KnService],
    handler: new TknConfigHandler(),
}
export = ConfigService;
