import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknFactorHandler } from "@willsofts/will-serv";

const FactorService : ServiceSchema = {
    name: "factor",
    mixins: [KnService],
    handler: new TknFactorHandler(), 
}
export = FactorService;
