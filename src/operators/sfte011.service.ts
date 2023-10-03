import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { Sfte011Handler } from "../sfte011/Sfte011Handler";

const Sfte011Service : ServiceSchema = {
    name: "sfte011",
    mixins: [KnService],
    handler: new Sfte011Handler(), 
}
export = Sfte011Service;
