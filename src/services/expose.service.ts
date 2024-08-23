import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknExposeHandler } from "../handlers/TknExposeHandler";

const ExposeService : ServiceSchema = {
    name: "expose",
    mixins: [KnService],
    handler: new TknExposeHandler(), 
}
export = ExposeService;
