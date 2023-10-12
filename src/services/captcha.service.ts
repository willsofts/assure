import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknCaptchaHandler } from "../handlers/TknCaptchaHandler";

const CaptchaService : ServiceSchema = {
    name: "captcha",
    mixins: [KnService],
    handler: new TknCaptchaHandler(), 
}
export = CaptchaService;
