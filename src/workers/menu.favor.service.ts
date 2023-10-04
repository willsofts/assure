import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknMenuFavorHandler } from "@willsofts/will-serv";

const MenuFavorService : ServiceSchema = {
    name: "menufavor",
    mixins: [KnService],
    handler: new TknMenuFavorHandler(), 
}
export = MenuFavorService;
