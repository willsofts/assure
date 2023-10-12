import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknMailHandler } from "../handlers/TknMailHandler";

const MailService : ServiceSchema = {
    name: "mail",
    mixins: [KnService],
    handler: new TknMailHandler(), 
}
export = MailService;
