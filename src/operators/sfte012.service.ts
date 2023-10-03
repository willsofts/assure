import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { Sfte012Handler } from "../sfte012/Sfte012Handler";

const Sfte012Service : ServiceSchema = {
    name: "sfte012",
    mixins: [KnService],
    handler: new Sfte012Handler(), 
}
export = Sfte012Service;
