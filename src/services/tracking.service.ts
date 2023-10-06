import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknTrackingHandler } from "@willsofts/will-core";

const TrackingService : ServiceSchema = {
    name: "tracking",
    mixins: [KnService],
    handler: new TknTrackingHandler(), 
}
export = TrackingService;
