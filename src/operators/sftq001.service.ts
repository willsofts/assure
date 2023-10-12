import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { Sftq001Handler } from "../sftq001/Sftq001Handler";

const Sftq001Service : ServiceSchema = {
    name: "sftq001",
    mixins: [KnService],
    handler: new Sftq001Handler(), 
}
export = Sftq001Service;
