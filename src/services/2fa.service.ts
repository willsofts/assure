import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknTwoFactorHandler } from "../handlers/TknTwoFactorHandler";

const TwoFactorService : ServiceSchema = {
    name: "2fa",
    mixins: [KnService],
    handler: new TknTwoFactorHandler(), 
}
export = TwoFactorService;
