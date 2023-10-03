import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknCaptchaHandler } from "@willsofts/will-core";

const CaptchaService : ServiceSchema = {
    name: "captcha",
    mixins: [KnService],
    handler: new TknCaptchaHandler(), 
}
export = CaptchaService;
