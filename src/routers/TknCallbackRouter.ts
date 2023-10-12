import { Request, Response } from 'express';
import { JSONReply } from '@willsofts/will-api';
import { KnResponser } from '../utils/KnResponser';
import { TknLoginHandler } from "../handlers/TknLoginHandler";
import { TknSigninHandler } from "../handlers/TknSigninHandler";
import { TknBaseRouter } from "./TknBaseRouter";

export class TknCallbackRouter extends TknBaseRouter {

    public async doLoginCallback(req: Request, res: Response) : Promise<void> {
        res.contentType('application/json');
        try {
            let ctx = await this.createContext(req);
            let handler = new TknLoginHandler();
            let rs = await handler.logincallback(ctx);
            res.end(JSON.stringify(rs));	
            return Promise.resolve();	
	    } catch(ex: any) {
		    KnResponser.responseError(res,ex,"login","callback");
        }
        return Promise.resolve();	
    }

    public async doLogoutCallback(req: Request, res: Response) : Promise<void> {
        res.contentType('application/json');
        try {
            let ctx = await this.createContext(req);
            let handler = new TknLoginHandler();
            let rs = await handler.logoutcallback(ctx);
            res.end(JSON.stringify(rs));	
            return Promise.resolve();	
	    } catch(ex: any) {
		    this.logger.error(ex);
        }
        let response = { authToken : "" };
        res.end(JSON.stringify(response));
        return Promise.resolve();	
    }
    
    public async doAnonymousLogin(req: Request, res: Response) : Promise<void> {
        res.contentType('application/json');
        try {
            let ctx = await this.createContext(req);
            let handler = new TknLoginHandler();
            let rs = await handler.anonymouslogin(ctx);
            res.end(JSON.stringify(rs));	
            return Promise.resolve();	
	    } catch(ex: any) {
		    this.logger.error(ex);
        }
        let response = { };
        res.status(500).end(JSON.stringify(response));
        return Promise.resolve();	
    }

    public async doSignin(req: Request, res: Response) : Promise<void> {
        res.contentType('application/json');
        try {
            let ctx = await this.createContext(req);
            let handler = new TknSigninHandler();
            let response = await handler.signin(ctx);
            res.end(JSON.stringify(response));
            return Promise.resolve();	
	    } catch(ex: any) {
		    this.logger.error(ex);
		    KnResponser.responseError(res,ex,"signin","signin");
        }
        return Promise.resolve();	
    }

    public async doFetchToken(req: Request, res: Response) : Promise<void> {
        res.contentType('application/json');
        try {
            let ctx = await this.createContext(req);
            let handler = new TknSigninHandler();
            let rs = await handler.fetchtoken(ctx);
            let response: JSONReply = new JSONReply();
            response.head.modeling("signin","fetchtoken");
            response.body = Object.fromEntries(rs);
            res.end(JSON.stringify(response));
            return Promise.resolve();	
	    } catch(ex: any) {
		    this.logger.error(ex);
		    KnResponser.responseError(res,ex,"signin","fetchtoken");
        }
        return Promise.resolve();	
    }

    public async doAccessToken(req: Request, res: Response) : Promise<void> {
        res.contentType('application/json');
        try {
            let ctx = await this.createContext(req);
            let handler = new TknSigninHandler();
            let rs = await handler.accesstoken(ctx);
            let response: JSONReply = new JSONReply();
            response.head.modeling("signin","accesstoken");
            response.body = Object.fromEntries(rs);
            res.end(JSON.stringify(response));
            return Promise.resolve();	
	    } catch(ex: any) {
		    this.logger.error(ex);
		    KnResponser.responseError(res,ex,"signin","accesstoken");
        }
        return Promise.resolve();	
    }

    public async doSignout(req: Request, res: Response) : Promise<void> {
        res.contentType('application/json');
        try {
            let ctx = await this.createContext(req);
            let handler = new TknSigninHandler();
            let rs = await handler.signout(ctx);
            let response: JSONReply = new JSONReply();
            response.head.modeling("signin","signout");
            response.body = Object.fromEntries(rs);
            res.end(JSON.stringify(response));
            return Promise.resolve();	
	    } catch(ex: any) {
		    this.logger.error(ex);
		    KnResponser.responseError(res,ex,"signin","signout");
        }
        return Promise.resolve();	
    }

}
