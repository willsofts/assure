import { Request, Response } from 'express';
import { HTTP, JSONReply } from "@willsofts/will-api";
import { AuthenError } from '@willsofts/will-lib';
import { Utilities } from '@willsofts/will-util';
import { KnLabelConfig } from '../utils/KnLabelConfig';
import { AuthenProvider } from '../authen/AuthenProvider';
import { AuthenConfig } from '../authen/AuthenConfig';
import { VerifyError } from "../models/VerifyError";
import { TknDirectoryHandler } from '../handlers/TknDirectoryHandler';
import { TknAssureRouter } from './TknAssureRouter';
import { REDIRECT_URI, REDIRECT_URI_LOGOUT } from '../utils/EnvironmentVariable';
import { TknSigninHandler } from '../handlers/TknSigninHandler';
import { KnResponser } from "../utils/KnResponser";

export class TknSAMLRouter extends TknAssureRouter {

    public successRedirect : string = '/auth';

    public async doSignin(req: Request, res: Response, next: Function) {
        this.logger.debug(this.constructor.name+".doSignin : "+req.originalUrl);
        let info = null;
        try {
            let ctx = await this.createContext(req,"authen");
            info = this.getMetaInfo(ctx);
            let handler = new TknDirectoryHandler();
            let rs = await handler.doGet(ctx);
            let adcfg = AuthenConfig.createADConfigure(rs);
            this.logger.debug(this.constructor.name+".doSignin: adcfg",adcfg);
            if(adcfg) {
                let msalcfg = adcfg.config;
                this.logger.debug(this.constructor.name+".doSignin: msalconfig",msalcfg);
                if(msalcfg) {
                    ctx.meta.session.msalconfig = msalcfg;
                    let provider = new AuthenProvider(msalcfg);
                    let routehandler = provider.login({
                        scopes: [],
                        redirectUri: REDIRECT_URI,
                        successRedirect: this.successRedirect
                    });
                    routehandler(req, res, next);
                    return;
                }
            }
            throw new VerifyError("Setting configuration not found",HTTP.NOT_ACCEPTABLE,-16101);
        } catch(ex: any) {
            this.logger.error(this.constructor.name+".doSignin: error",ex);
            if(!info) {
                let ctx = this.buildContext(req);
                info = this.getMetaInfo(ctx);
            }
            res.render("pages/error",{error: ex, meta: info});
        }
    }

    public async doRedirect(req: Request, res: Response, next: Function) {    
        this.logger.debug(this.constructor.name+".doRedirect : "+req.originalUrl);
        let info = null;
        try {
            let ctx = await this.createContext(req,"authen");
            info = this.getMetaInfo(ctx);
            let msalcfg = ctx.meta.session.msalconfig;
            this.logger.debug(this.constructor.name+".doRedirect: msalconfig",msalcfg);
            if(msalcfg) {
                let provider = new AuthenProvider(msalcfg);
                let routehandler = provider.handleRedirect();
                routehandler(req, res, next);
                return;
            }
            throw new VerifyError("Configuration not found",HTTP.NOT_ACCEPTABLE,-16102);
        } catch(ex: any) {
            this.logger.error(this.constructor.name+".doRedirect: error",ex);
            if(!info) {
                let ctx = this.buildContext(req);
                info = this.getMetaInfo(ctx);
            }
            res.render("pages/error",{error: ex, meta: info});
        }
    }

    public async doSignout(req: Request, res: Response, next: Function) {    
        this.logger.debug(this.constructor.name+".doSignout : "+req.originalUrl);
        let info = null;
        try {
            let ctx = await this.createContext(req,"authen");
            info = this.getMetaInfo(ctx);
            let msalcfg = ctx.meta.session.msalconfig;
            this.logger.debug(this.constructor.name+".doSignout: msalconfig",msalcfg);
            if(msalcfg) {
                let provider = new AuthenProvider(msalcfg);
                let routehandler = provider.logout({
                    postLogoutRedirectUri: REDIRECT_URI_LOGOUT
                });
                routehandler(req, res, next);
                return;
            }
            throw new VerifyError("Configuration not found",HTTP.NOT_ACCEPTABLE,-16102);
        } catch(ex: any) {
            this.logger.error(this.constructor.name+".doSignout: error",ex);
            if(!info) {
                let ctx = this.buildContext(req);
                info = this.getMetaInfo(ctx);
            }
            res.render("pages/error",{error: ex, meta: info});
        }
    }

    public async doAuthen(req: Request, res: Response, next: Function) {    
        this.logger.debug(this.constructor.name+".doAuthen : "+req.originalUrl);
        let ctx = null;
        let info = null;
        let label = null;
        let workdir = null;
        try {
            ctx = await this.createContext(req,"authen");
            info = this.getMetaInfo(ctx);
            workdir = Utilities.getWorkingDir(this.dir); 
            label = new KnLabelConfig("index", info.language);
            try { await label.load(workdir); } catch(ex) { this.logger.error(this.constructor.name+".doOpen: error",ex); }        
            let isAuthenticated = ctx.meta.session.isAuthenticated;
            let username = ctx.meta.session.account?.username;
            if(!username || username=="") username = ctx.meta.session.account?.idTokenClaims?.given_name;
            this.logger.debug(this.constructor.name+".doAuthen : isAuthenticated="+isAuthenticated+", account=",ctx.meta.session.account);
            if(isAuthenticated && username) {
                let handler = new TknSigninHandler();
                ctx.params.username = username;
                let response = await handler.access(ctx);
                if(response.head.errorflag=="N") {
                    let param = { meta : info, label: label, data: response, auth: {isAuthenticated: isAuthenticated, account: ctx.meta.session.account}};
                    res.render("pages/authen",param);
                    return;
                }
            }
            res.redirect("/login");
        } catch(ex: any) {
            this.logger.error(this.constructor.name+".doAuthen: error",ex);
            if(!info || !ctx) {
                ctx = this.buildContext(req);
                info = this.getMetaInfo(ctx);
            }
            if(ex instanceof AuthenError) {
                let aex = ex as AuthenError;
                if(aex.code==HTTP.UNAUTHORIZED && aex.errno==-4004) {
                    if(!label) {
                        if(!workdir) workdir = Utilities.getWorkingDir(this.dir); 
                        label = new KnLabelConfig("index", info.language);
                        try { await label.load(workdir); } catch(ex) { this.logger.error(this.constructor.name+".doOpen: error",ex); }
                    }
                    let msg = "Please contact your administrator for more details";
                    res.render("pages/userpage",{error: ex, meta: info, info: msg, label: label, auth: {account: ctx.meta.session.account}});
                    return;
                }
            }
            res.render("pages/error",{error: ex, meta: info});
        }
    }
    
    public async doAcquire(req: Request, res: Response, next: Function) {    
        this.logger.debug(this.constructor.name+".doAcquire : "+req.originalUrl);
        let info = null;
        try {
            let ctx = await this.createContext(req,"authen");
            info = this.getMetaInfo(ctx);
            let msalcfg = ctx.meta.session.msalconfig;
            this.logger.debug(this.constructor.name+".doAcquire: msalconfig",msalcfg);
            if(msalcfg) {
                let provider = new AuthenProvider(msalcfg);
                let routehandler = provider.acquireToken({
                    scopes: [],
                    redirectUri: REDIRECT_URI,
                    successRedirect: this.successRedirect
                });
                routehandler(req, res, next);
                return;
            }
            throw new VerifyError("Configuration not found",HTTP.NOT_ACCEPTABLE,-16102);
        } catch(ex: any) {
            this.logger.error(this.constructor.name+".doAcquire: error",ex);
            res.redirect("/login");
        }
    }

    public async doConfig(req: Request, res: Response, next: Function) {    
        this.logger.debug(this.constructor.name+".doConfig : "+req.originalUrl);
        let ctx = await this.createContext(req,"authen");
        let info = this.getMetaInfo(ctx);
        try {
            let handler = new TknDirectoryHandler();
            let rs = await handler.doGet(ctx);
            let adcfg = AuthenConfig.createADConfigure(rs);
            if(adcfg) {
                let response: JSONReply = new JSONReply();
                response.head.modeling("authen","config");
                response.body = adcfg;
                res.contentType('application/json');
                res.end(JSON.stringify(response));
                return;
            }
            throw new VerifyError("Configuration not found",HTTP.NOT_ACCEPTABLE,-16102);
        } catch(ex: any) {
            this.logger.error(this.constructor.name+".doConfig: error",ex);
            if("true"==ctx.params.ajax) {
                KnResponser.responseError(res,ex,"authen","config");
                return;
            }
            res.render("pages/error",{error: ex, meta: info});
        }
    }

}
