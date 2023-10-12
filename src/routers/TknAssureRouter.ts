import { KnContextInfo } from "../models/KnCoreAlias";
import { TknBaseRouter } from "../routers/TknBaseRouter";
import { TknAuthorizeHandler } from "../handlers/TknAuthorizeHandler";
import { KnUtility } from "../utils/KnUtility";
import { AuthenTokenData, UserTokenInfo } from "@willsofts/will-lib";
import { KnMetaInfo } from '../models/KnServAlias';
import { RELEASE_VERSION, BASE_URL, API_URL, REDIRECT_URL, MESSAGE_URL, EXCEPT_LAUNCH_PATH } from "../utils/EnvironmentVariable";

export class TknAssureRouter extends TknBaseRouter {
    public getMetaInfo(context?: any) : KnMetaInfo {
        return { 
            api_url: API_URL,
            base_url: BASE_URL, 
            redirect_url: REDIRECT_URL, 
            message_url: MESSAGE_URL,
            language: KnUtility.getDefaultLanguage(context),
            version: RELEASE_VERSION,
            token: this.getTokenKey(context)
        };
    }

    public isExceptLaunchPath(req: any) : boolean {
        if(req && req.originalUrl && EXCEPT_LAUNCH_PATH) {
            let paths = EXCEPT_LAUNCH_PATH.split(",");
            for(let p of paths) {
                if(req.originalUrl.indexOf(p)>=0) {
                    return true;
                }
            }
        }
        return false;
    }

    public getTokenKey(context: KnContextInfo) : string | undefined {
        let handler = new TknAuthorizeHandler();
        return handler.getTokenKey(context);
    }
    
    public async validateAuthenToken(context: KnContextInfo) : Promise<AuthenTokenData | undefined> {
        let handler = new TknAuthorizeHandler();
        return handler.validateAuthenToken(context);
    }

    public async validateUserToken(context: KnContextInfo) : Promise<UserTokenInfo | undefined> {
        let handler = new TknAuthorizeHandler();
        return handler.authorize(context);
    }
    
    public async validateLauncher(context: KnContextInfo) {
        if(this.isExceptLaunchPath(context.meta.req)) {
            return Promise.resolve();
        }
        await this.validateUserToken(context);
    }

}