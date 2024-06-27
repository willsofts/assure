import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { Demo002Handler } from "../demo002/Demo002Handler";

const Demo002Service : ServiceSchema = {
    name: "demo002",
    mixins: [KnService],
    handler: new Demo002Handler(), 
}
export = Demo002Service;
