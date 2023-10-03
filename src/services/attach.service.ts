import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknAttachHandler } from "@willsofts/will-core";

const AttachService : ServiceSchema = {
    name: "attach",
    mixins: [KnService],
    handler: new TknAttachHandler(), 
}
export = AttachService;
