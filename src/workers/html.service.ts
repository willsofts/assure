import { ServiceSchema } from "moleculer";
import KnService from "@willsofts/will-db";
import { TknHtmlHandler } from "../handlers/TknHtmlHandler";

const HtmlService : ServiceSchema = {
    name: "html",
    mixins: [KnService],
    handler: new TknHtmlHandler(), 
}
export = HtmlService;

