import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { FactorHandler } from "../factor/FactorHandler";

const FactorService : ServiceSchema = {
    name: "factor",
    mixins: [KnService],
    handler: new FactorHandler(), 
}
export = FactorService;
