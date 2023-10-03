import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknDataTableHandler } from "@willsofts/will-core";

const DataTableService : ServiceSchema = {
    name: "datatable",
    mixins: [KnService],
    handler: new TknDataTableHandler(), 
}
export = DataTableService;
