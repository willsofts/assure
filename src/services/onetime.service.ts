import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknOneTimeHandler } from "../handlers/TknOneTimeHandler";

const OneTimeService : ServiceSchema = {
    name: "onetime",
    mixins: [KnService],
    handler: new TknOneTimeHandler(), 
}
export = OneTimeService;
