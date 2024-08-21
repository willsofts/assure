import KnAPI from "@willsofts/will-api";
import { ServiceSchema } from "moleculer";
import { TknAssureHandler } from "../handlers/TknAssureHandler";

const GatewayService : ServiceSchema = {
    name: "api",
    mixins: [KnAPI],
    settings: {
        //when using express must defined server = false
        //server: false,
        path: "/api",
        routes: [
            {
                authorization: true,
                aliases: {
                    "GET fetch/hi/:name": "fetch.hi",
                    "GET fetch/time/:name": "fetch.time",
                    "GET fetch/config/:name": "fetch.config",

                    "POST sign/fetchtoken/:useruuid": "sign.fetchtoken",
                    "GET sign/fetchtoken/:useruuid": "sign.fetchtoken",
                }
            }
        ],
		assets: {
			folder: "public",
		}
    },
    methods: {
        async authorize(ctx, route, req, res) {
            return TknAssureHandler.doAuthorizeFilter(ctx, req);
        }
    },
    started() {
        (this as any).broker.call("$node.services").then((services: any) => {
            let servicenames = [];
            for(let s of services) {
                if(s.name!="$node" && s.name!="api") {
                    servicenames.push(s.name);
                }
            }
            console.log("service names",servicenames);
            console.log("number of services",servicenames.length);
        });
    }    
};

export = GatewayService;
