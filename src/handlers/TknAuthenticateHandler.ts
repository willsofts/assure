import { KnModel } from "@willsofts/will-db";
import { UserTokenInfo, PasswordLibrary } from '@willsofts/will-lib';
import { HTTP } from "@willsofts/will-api";
import { VerifyError } from "../models/VerifyError";
import { KnContextInfo } from '../models/KnCoreAlias';
import { VALIDATE_TOKEN, ALWAYS_VALIDATE_TOKEN } from "../utils/EnvironmentVariable";
import { TknSchemeHandler } from "./TknSchemeHandler";

export class TknAuthenticateHandler extends TknSchemeHandler {
    public model : KnModel = { name: "tusertoken", alias: { privateAlias: this.section } };

    //declared addon actions name
    public handlers = [ {name: "authenticate"} ];

    public async authenticate(context: KnContextInfo) : Promise<UserTokenInfo | undefined> {
        return this.callFunctional(context, {operate: "authenticate", raw: false}, this.doAuthenticate);
    }

    protected async doAuthenticate(context: KnContextInfo, model: KnModel) : Promise<UserTokenInfo | undefined> {
        if(!VALIDATE_TOKEN) return Promise.resolve(undefined);
		let atoken = await this.getAuthenToken(context, false, true);
		if (atoken != undefined) {
            let db = this.getPrivateConnector(model); 
            try {
                let plib : PasswordLibrary = new PasswordLibrary();
                let ut = await plib.getUserTokenInfo(db, atoken.identifier);
                if(!ut.userid) {
                    return Promise.reject(new VerifyError("Token not found",HTTP.UNAUTHORIZED,-16003)); 
                }
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

}
