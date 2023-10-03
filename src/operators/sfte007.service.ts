import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { Sfte007Handler } from "../sfte007/Sfte007Handler";

const Sfte007Service : ServiceSchema = {
    name: "sfte007",
    mixins: [KnService],
    handler: new Sfte007Handler(), 
}
export = Sfte007Service;
