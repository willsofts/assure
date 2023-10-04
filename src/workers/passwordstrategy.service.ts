import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknPasswordStrategyHandler } from "@willsofts/will-serv";

const PasswordStrategyService : ServiceSchema = {
    name: "passwordstrategy",
    mixins: [KnService],
    handler: new TknPasswordStrategyHandler(), 
}
export = PasswordStrategyService;
