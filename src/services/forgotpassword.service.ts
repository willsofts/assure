import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknForgotPasswordHandler } from "../handlers/TknForgotPasswordHandler";

const ForgotPasswordService : ServiceSchema = {
    name: "forgot",
    mixins: [KnService],
    handler: new TknForgotPasswordHandler(), 
}
export = ForgotPasswordService;
