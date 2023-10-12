import { TknAuthorizeHandler } from "./TknAuthorizeHandler";
import { TknAuthenticateHandler } from "./TknAuthenticateHandler";
import { KnContextInfo } from '../models/KnCoreAlias';
import { EXCEPT_AUTHORIZE_PATH } from "../utils/EnvironmentVariable"

export class TknAssureHandler {

    public static isExceptPath(req: any) : boolean {
        if(req && req.originalUrl && EXCEPT_AUTHORIZE_PATH) {
            let paths = EXCEPT_AUTHORIZE_PATH.split(",");
            for(let p of paths) {
                if(req.originalUrl.indexOf(p)>=0) {
                    return true;
                }
            }
        }
        return false;
    }

    public static async doAuthorizeFilter(ctx: KnContextInfo, req: any) {
        if(this.isExceptPath(req)) {
            return Promise.resolve(ctx);
        }
        ctx.meta.req = req;
        return this.doAuthorize(ctx);
    }

    public static async doAuthenticateFilter(ctx: KnContextInfo, req: any) {
        if(this.isExceptPath(req)) {
            return Promise.resolve(ctx);
        }
        ctx.meta.req = req;
        return this.doAuthenticate(ctx);
    }

    public static async doAuthorize(ctx: KnContextInfo) {
        try {
            //check session is already exist?
            if(ctx.meta.user) {
                return Promise.resolve(ctx);
            }
            if(ctx.meta.session && ctx.meta.session.user) {
                ctx.meta.user = ctx.meta.session.user;
                return Promise.resolve(ctx);
            }
            let handler = new TknAuthorizeHandler();
            let ut = await handler.authorize(ctx);
            if(ut) {
                if(ctx.meta.session) ctx.meta.session.user = ut;
                ctx.meta.user = ut;
            }
            return Promise.resolve(ctx);
        } catch(ex) {
            return Promise.reject(ex);
        }
    }

    public static async doAuthenticate(ctx: KnContextInfo) {
        try {
            //check session is already exist?
            if(ctx.meta.user) {
                return Promise.resolve(ctx.meta.user);
            }
            if(ctx.meta.session && ctx.meta.session.user) {
                return Promise.resolve(ctx.meta.session.user);
            }
            let handler = new TknAuthenticateHandler();
            let ut = await handler.authenticate(ctx);
            if(ut) {
                if(ctx.meta.session) ctx.meta.session.user = ut;
            }
            return Promise.resolve(ut);
        } catch(ex) {
        }
        return Promise.resolve(undefined);
    }

}