import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknPasswordPolicyHandler } from "../handlers/TknPasswordPolicyHandler";

const PasswordPolicyService : ServiceSchema = {
    name: "passwordpolicy",
    mixins: [KnService],
    handler: new TknPasswordPolicyHandler(), 
}
export = PasswordPolicyService;
