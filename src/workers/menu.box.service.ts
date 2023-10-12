import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknMenuBoxHandler } from "../handlers/TknMenuBoxHandler";

const MenuBoxService : ServiceSchema = {
    name: "menubox",
    mixins: [KnService],
    handler: new TknMenuBoxHandler(), 
}
export = MenuBoxService;
