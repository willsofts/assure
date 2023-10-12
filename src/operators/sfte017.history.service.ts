import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { Sfte017HistoryHandler } from "../sfte017/Sfte017HistoryHandler";

const Sfte017HistoryService : ServiceSchema = {
    name: "sfte017history",
    mixins: [KnService],
    handler: new Sfte017HistoryHandler(), 
}
export = Sfte017HistoryService;
