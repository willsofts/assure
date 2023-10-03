import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknFactorHandler } from "../factor/TknFactorHandler";

const FactorService : ServiceSchema = {
    name: "factor",
    mixins: [KnService],
    handler: new TknFactorHandler(), 
}
export = FactorService;
