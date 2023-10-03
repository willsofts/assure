import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { Sfte002Handler } from "../sfte002/Sfte002Handler";

const Sfte002Service : ServiceSchema = {
    name: "sfte002",
    mixins: [KnService],
    handler: new Sfte002Handler(), 
}
export = Sfte002Service;
