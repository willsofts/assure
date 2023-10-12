import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { Sftq003Handler } from "../sftq003/Sftq003Handler";

const Sftq003Service : ServiceSchema = {
    name: "sftq003",
    mixins: [KnService],
    handler: new Sftq003Handler(), 
}
export = Sftq003Service;
