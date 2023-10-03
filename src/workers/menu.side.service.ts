import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknMenuSideBarHandler } from "../handlers/TknMenuSideBarHandler";

const MenuSideBarService : ServiceSchema = {
    name: "menuside",
    mixins: [KnService],
    handler: new TknMenuSideBarHandler(), 
}
export = MenuSideBarService;
