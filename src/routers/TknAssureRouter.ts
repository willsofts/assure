import { KnContextInfo } from "../models/KnCoreAlias";
import { TknBaseRouter } from "../routers/TknBaseRouter";
import { TknAuthorizeHandler } from "../handlers/TknAuthorizeHandler";
import { KnUtility } from "../utils/KnUtility";
import { AuthenTokenData, UserTokenInfo } from "@willsofts/will-lib";
import { KnMetaInfo } from '../models/KnServAlias';
import { META_INFO, RELEASE_VERSION, API_URL, BASE_URL, CDN_URL, IMG_URL, REDIRECT_URL, MESSAGE_URL, EXCEPT_LAUNCH_PATH, BASE_STORAGE, ALLOW_RAW_PARAMETERS, SECURE_STORAGE, CHAT_URL } from "../utils/EnvironmentVariable";

export class TknAssureRouter extends TknBaseRouter {
    public getMetaInfo(context?: any) : KnMetaInfo {
        return { 
            api_url: API_URL,
            base_url: BASE_URL,
            cdn_url: CDN_URL, 
            img_url: IMG_URL,
            chat_url: CHAT_URL,
            redirect_url: REDIRECT_URL, 
            message_url: MESSAGE_URL,            
            language: KnUtility.getDefaultLanguage(context),
            version: RELEASE_VERSION,
            storage: BASE_STORAGE,
            secure_storage: SECURE_STORAGE,
            raw_parameters: ALLOW_RAW_PARAMETERS,
            token: this.getTokenKey(context),
            info: META_INFO
        };
    }

    public isExceptLaunchPath(req: any) : boolean {
        if(req && req.originalUrl && EXCEPT_LAUNCH_PATH) {
            let paths = EXCEPT_LAUNCH_PATH.split(",");
            for(let p of paths) {
                if(req.originalUrl==p || req.originalUrl.indexOf(p)>=0) {
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