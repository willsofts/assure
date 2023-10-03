import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknChangePasswordHandler } from "@willsofts/will-core";

const ChangePasswordService : ServiceSchema = {
    name: "password",
    mixins: [KnService],
    handler: new TknChangePasswordHandler(), 
}
export = ChangePasswordService;
