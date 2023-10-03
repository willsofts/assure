import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknPasswordStrategyHandler } from "../handlers/TknPasswordStrategyHandler";

const PasswordStrategyService : ServiceSchema = {
    name: "passwordstrategy",
    mixins: [KnService],
    handler: new TknPasswordStrategyHandler(), 
}
export = PasswordStrategyService;
