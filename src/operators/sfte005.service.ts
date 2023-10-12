import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { Sfte005Handler } from "../sfte005/Sfte005Handler";

const Sfte005Service : ServiceSchema = {
    name: "sfte005",
    mixins: [KnService],
    handler: new Sfte005Handler(), 
}
export = Sfte005Service;
