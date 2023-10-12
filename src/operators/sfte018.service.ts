import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { Sfte018Handler } from "../sfte018/Sfte018Handler";

const Sfte018Service : ServiceSchema = {
    name: "sfte018",
    mixins: [KnService],
    handler: new Sfte018Handler(), 
}
export = Sfte018Service;
