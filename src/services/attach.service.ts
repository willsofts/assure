import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknAttachHandler } from "../handlers/TknAttachHandler";

const AttachService : ServiceSchema = {
    name: "attach",
    mixins: [KnService],
    handler: new TknAttachHandler(), 
}
export = AttachService;
