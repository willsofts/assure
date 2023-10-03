import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknDiffieHandler } from "@willsofts/will-core";

const DiffieService : ServiceSchema = {
    name: "crypto",
    mixins: [KnService],
    handler: new TknDiffieHandler(), 
}
export = DiffieService;
