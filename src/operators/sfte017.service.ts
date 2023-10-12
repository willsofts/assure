import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { Sfte017Handler } from "../sfte017/Sfte017Handler";

const Sfte017Service : ServiceSchema = {
    name: "sfte017",
    mixins: [KnService],
    handler: new Sfte017Handler(), 
}
export = Sfte017Service;
