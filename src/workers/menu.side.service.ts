import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknMenuSideBarHandler } from "@willsofts/will-serv";

const MenuSideBarService : ServiceSchema = {
    name: "menuside",
    mixins: [KnService],
    handler: new TknMenuSideBarHandler(), 
}
export = MenuSideBarService;
