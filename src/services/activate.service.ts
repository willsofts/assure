import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknActivateHandler } from "../handlers/TknActivateHandler";

const ActivateService : ServiceSchema = {
    name: "activate",
    mixins: [KnService],
    handler: new TknActivateHandler(), 
}
export = ActivateService;
