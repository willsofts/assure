import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknSigninHandler } from "@willsofts/will-core";

const SigninService : ServiceSchema = {
    name: "sign",
    mixins: [KnService],
    handler: new TknSigninHandler(), 
}
export = SigninService;

