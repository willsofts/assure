import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknPasswordPolicyHandler } from "@willsofts/will-core";

const PasswordPolicyService : ServiceSchema = {
    name: "passwordpolicy",
    mixins: [KnService],
    handler: new TknPasswordPolicyHandler(), 
}
export = PasswordPolicyService;
