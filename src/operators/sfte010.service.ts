import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { Sfte010Handler } from "../sfte010/Sfte010Handler";

const Sfte010Service : ServiceSchema = {
    name: "sfte010",
    mixins: [KnService],
    handler: new Sfte010Handler(), 
}
export = Sfte010Service;
