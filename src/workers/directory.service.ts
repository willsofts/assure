import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknDirectoryHandler } from "../handlers/TknDirectoryHandler";

const DirectoryService : ServiceSchema = {
    name: "directory",
    mixins: [KnService],
    handler: new TknDirectoryHandler(), 
}
export = DirectoryService;
