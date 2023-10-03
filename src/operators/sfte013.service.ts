import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { Sfte013Handler } from "../sfte013/Sfte013Handler";

const Sfte013Service : ServiceSchema = {
    name: "sfte013",
    mixins: [KnService],
    handler: new Sfte013Handler(), 
}
export = Sfte013Service;
