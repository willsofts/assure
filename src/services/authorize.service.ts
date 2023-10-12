import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknAuthorizeHandler } from "../handlers/TknAuthorizeHandler";

const AuthorizeService : ServiceSchema = {
    name: "authorize",
    mixins: [KnService],
    handler: new TknAuthorizeHandler(), 
}
export = AuthorizeService;
