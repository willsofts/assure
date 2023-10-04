import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknMenuBoxHandler } from "@willsofts/will-serv";

const MenuBoxService : ServiceSchema = {
    name: "menubox",
    mixins: [KnService],
    handler: new TknMenuBoxHandler(), 
}
export = MenuBoxService;
