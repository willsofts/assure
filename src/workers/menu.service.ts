import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknMenuHandler } from "@willsofts/will-serv";

const MenuService : ServiceSchema = {
    name: "menu",
    mixins: [KnService],
    handler: new TknMenuHandler(), 
}
export = MenuService;
