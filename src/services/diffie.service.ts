import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknDiffieHandler } from "../handlers/TknDiffieHandler";

const DiffieService : ServiceSchema = {
    name: "crypto",
    mixins: [KnService],
    handler: new TknDiffieHandler(), 
}
export = DiffieService;
