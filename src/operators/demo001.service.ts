import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { Demo001Handler } from "../demo001/Demo001Handler";

const Demo001Service : ServiceSchema = {
    name: "demo001",
    mixins: [KnService],
    handler: new Demo001Handler(), 
}
export = Demo001Service;
