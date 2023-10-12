import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknProgramHandler } from "../handlers/TknProgramHandler";

const ProgramService : ServiceSchema = {
    name: "program",
    mixins: [KnService],
    handler: new TknProgramHandler(), 
}
export = ProgramService;
