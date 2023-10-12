import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknTrailingHandler } from "../handlers/TknTrailingHandler";

const TrailingService : ServiceSchema = {
    name: "trailing",
    mixins: [KnService],
    handler: new TknTrailingHandler(), 
}
export = TrailingService;
