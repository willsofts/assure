import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknLabelHandler } from "../handlers/TknLabelHandler";

const LabelService : ServiceSchema = {
    name: "label",
    mixins: [KnService],
    handler: new TknLabelHandler(), 
}
export = LabelService;
