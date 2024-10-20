import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknMenuFavorHandler } from "../handlers/TknMenuFavorHandler";

const MenuFavorService : ServiceSchema = {
    name: "menufavor",
    mixins: [KnService],
    handler: new TknMenuFavorHandler(), 
}
export = MenuFavorService;
