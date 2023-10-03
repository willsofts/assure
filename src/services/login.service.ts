import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknLoginHandler } from "@willsofts/will-core";

const LoginService : ServiceSchema = {
    name: "login",
    mixins: [KnService],
    handler: new TknLoginHandler(), 
}
export = LoginService;
