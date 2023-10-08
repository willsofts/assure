import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknTrailingHandler } from "@willsofts/will-core";

const TrailingService : ServiceSchema = {
    name: "trailing",
    mixins: [KnService],
    handler: new TknTrailingHandler(), 
}
export = TrailingService;
