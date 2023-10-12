import { KnModel } from "@willsofts/will-db";
import { UserTokenInfo, PasswordLibrary, AuthenToken, AuthenTokenData } from '@willsofts/will-lib';
import { HTTP } from "@willsofts/will-api";
import { KnDBConnector } from "@willsofts/will-sql";
import { VerifyError } from "../models/VerifyError";
import { KnContextInfo } from '../models/KnCoreAlias';
import { VALIDATE_TOKEN, VALIDATE_TOKEN_NOT_FOUND, VALIDATE_ANOMYMOUS_TOKEN, ALWAYS_VALIDATE_TOKEN } from "../utils/EnvironmentVariable";
import { TknSchemeHandler } from "./TknSchemeHandler";

export class TknAuthorizeHandler extends TknSchemeHandler {
    public model : KnModel = { name: "tusertoken", alias: { privateAlias: this.section } };

    //declared addon actions name
    public handlers = [ {name: "authorize"} ];

    public async authorize(context: KnContextInfo) : Promise<UserTokenInfo | undefined> {
        return this.callFunctional(context, {operate: "authorize", raw: false}, this.doAuthorize);
    }

    public async doAuthorize(context: KnContextInfo, model: KnModel) : Promise<UserTokenInfo | undefined> {
        if(!VALIDATE_TOKEN) return Promise.resolve(undefined);
        let token = this.getTokenKey(context);
        this.logger.debug(this.constructor.name+".doAuthorize: token="+token);
        if (token != undefined) {
            let db = this.getPrivateConnector(model); 
            try {                
                let ut = await this.getAuthorizeTokenInfo(db, token);
                //this.logger.debug(this.constructor.name+".doAuthorize: info",ut);
                return Promise.resolve(ut);
            } catch(ex: any) {
                this.logger.error(this.constructor.name,ex);
                return Promise.reject(this.getDBError(ex));
            } finally {
                if(db) db.close();
            }          
        }
        if(!ALWAYS_VALIDATE_TOKEN) return Promise.resolve(undefined);        
        return Promise.reject(new VerifyError("Token undefined",HTTP.UNAUTHORIZED,-16002));
    }

    public async getAuthorizeTokenInfo(db: KnDBConnector, token: string) : Promise<UserTokenInfo | undefined> {
        const atoken: AuthenTokenData = AuthenToken.verifyAuthenToken(token, false);
        if (atoken.identifier == undefined) {
            return Promise.reject(new VerifyError("Token is invalid",HTTP.UNAUTHORIZED,-16001));
        }
        let ut = await this.getAuthorizeToken(db, atoken, VALIDATE_TOKEN_NOT_FOUND, VALIDATE_ANOMYMOUS_TOKEN);
        return Promise.resolve(ut);
    }

    public async getAuthorizeToken(db: KnDBConnector, atoken: AuthenTokenData, verifyTokenNotFound: boolean = true, verifyAnonymousToken: boolean = true) : Promise<UserTokenInfo | undefined> {
        let plib : PasswordLibrary = new PasswordLibrary();
        let ut = await plib.getUserTokenInfo(db, atoken.identifier);
        if(verifyTokenNotFound && !ut.userid) {
            return Promise.reject(new VerifyError("Token not found",HTTP.UNAUTHORIZED,-16003)); 
        }
        if(verifyAnonymousToken && "A"==ut.tokentype) {
            return Promise.reject(new VerifyError("Token is anonymous",HTTP.UNAUTHORIZED,-16007)); 
        }
        return Promise.resolve(ut);
    }

}
