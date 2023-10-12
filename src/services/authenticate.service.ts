import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknAuthenticateHandler } from "../handlers/TknAuthenticateHandler";

const AuthenticateService : ServiceSchema = {
    name: "authen",
    mixins: [KnService],
    handler: new TknAuthenticateHandler(), 
}
export = AuthenticateService;
