import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { Sfte003Handler } from "../sfte003/Sfte003Handler";

const Sfte003Service : ServiceSchema = {
    name: "sfte003",
    mixins: [KnService],
    handler: new Sfte003Handler(), 
}
export = Sfte003Service;
