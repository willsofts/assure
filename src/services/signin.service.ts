import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknSigninHandler } from "../handlers/TknSigninHandler";

const SigninService : ServiceSchema = {
    name: "sign",
    mixins: [KnService],
    handler: new TknSigninHandler(), 
}
export = SigninService;

