import KnService from "@willsofts/will-db";
import { ServiceSchema } from "moleculer";
import { TknProfileHandler } from "@willsofts/will-serv";

const ProfileService : ServiceSchema = {
    name: "profile",
    mixins: [KnService],
    handler: new TknProfileHandler(), 
}
export = ProfileService;

