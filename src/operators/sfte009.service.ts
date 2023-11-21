import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { Sfte009Handler } from "../sfte009/Sfte009Handler";

const Sfte009Service : ServiceSchema = {
    name: "sfte009",
    mixins: [KnService],
    handler: new Sfte009Handler(), 
}
export = Sfte009Service;
