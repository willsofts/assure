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
        ]
    },
    methods: {
        async authorize(ctx, route, req, res) {
            return TknAssureHandler.doAuthorizeFilter(ctx, req);
        }
    },
};

export = GatewayService;
