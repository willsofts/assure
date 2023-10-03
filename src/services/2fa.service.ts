import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknTwoFactorHandler } from "@willsofts/will-core";

const TwoFactorService : ServiceSchema = {
    name: "2fa",
    mixins: [KnService],
    handler: new TknTwoFactorHandler(), 
}
export = TwoFactorService;
