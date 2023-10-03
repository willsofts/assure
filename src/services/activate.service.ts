import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknActivateHandler } from "@willsofts/will-core";

const ActivateService : ServiceSchema = {
    name: "activate",
    mixins: [KnService],
    handler: new TknActivateHandler(), 
}
export = ActivateService;
