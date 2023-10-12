import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknLoginHandler } from "../handlers/TknLoginHandler";

const LoginService : ServiceSchema = {
    name: "login",
    mixins: [KnService],
    handler: new TknLoginHandler(), 
}
export = LoginService;
