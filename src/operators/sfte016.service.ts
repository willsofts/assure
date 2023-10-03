import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { Sfte016Handler } from "../sfte016/Sfte016Handler";

const Sfte016Service : ServiceSchema = {
    name: "sfte016",
    mixins: [KnService],
    handler: new Sfte016Handler(), 
}
export = Sfte016Service;
