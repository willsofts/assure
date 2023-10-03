import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { Sfte001Handler } from "../sfte001/Sfte001Handler";

const Sfte001Service : ServiceSchema = {
    name: "sfte001",
    mixins: [KnService],
    handler: new Sfte001Handler(), 
}
export = Sfte001Service;
