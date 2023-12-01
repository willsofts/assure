import { Request, Response } from 'express';
import { Utilities } from '@willsofts/will-util';
import { KnLabelConfig } from '../utils/KnLabelConfig';
import { TknAssureRouter } from './TknAssureRouter';
import { TknDirectoryHandler } from '../handlers/TknDirectoryHandler';
import { ALLOW_AUTHEN_SAML, META_INFO, CONTENT_SECURITY_POLICY } from '../utils/EnvironmentVariable';

export class TknRenderRouter extends TknAssureRouter {
    
    public async doLogin(req: Request, res: Response) {
        this.logger.debug(this.constructor.name+".doLogin : "+req.originalUrl);
        let ctx = await this.createContext(req);
        //do not acceapt any parameters
        if(Object.keys(ctx.params).length>0) {
            res.status(400).end("Invalid Request");
            return;
        }
        let info = this.getMetaInfo(ctx);
        let data = { };
        if(ALLOW_AUTHEN_SAML) {
            let appstype = META_INFO["appstype"];
            if(appstype) {
                ctx.params.appstype = appstype;
            }
            try {
                let handler = new TknDirectoryHandler();
                let rs = await handler.doList(ctx);
                data = { dataset: rs };
            } catch(ex: any) {
                this.logger.error(this.constructor.name+".doLogin: error",ex);
            }
        }
        let workdir = Utilities.getWorkingDir(this.dir); 
        let label = new KnLabelConfig("index", info.language);
        try { await label.load(workdir); } catch(ex) { this.logger.error(this.constructor.name+".doOpen: error",ex); }        
        let param = { meta : {...info, state: req.query.state, nonce: req.query.nonce}, label: label, auth: {}, data: data };
        this.logger.debug("info",param);
        if(CONTENT_SECURITY_POLICY!="") {
            res.header("Content-Security-Policy", CONTENT_SECURITY_POLICY);
        }
        res.render('pages/login',param);
    }

    public async doMain(req: Request, res: Response) {
        this.logger.debug(this.constructor.name+".doMain : "+req.originalUrl);
        let ctx = await this.createContext(req);
        //do not acceapt any parameters
        if(Object.keys(ctx.params).length>0) {
            res.status(400).end("Invalid Request");
            return;
        }
        let info = this.getMetaInfo(ctx);
        let data = { };
        if(ALLOW_AUTHEN_SAML) {
            let appstype = META_INFO["appstype"];
            if(appstype) {
                ctx.params.appstype = appstype;
            }
            try {
                let handler = new TknDirectoryHandler();
                let rs = await handler.doList(ctx);
                data = { dataset: rs };
            } catch(ex: any) {
                this.logger.error(this.constructor.name+".doLogin: error",ex);
            }
        }
        let workdir = Utilities.getWorkingDir(this.dir); 
        let label = new KnLabelConfig("index", info.language);
        try { await label.load(workdir); } catch(ex) { this.logger.error(this.constructor.name+".doOpen: error",ex); }        
        let param = { meta : {...info, state: req.query.state, nonce: req.query.nonce}, label: label, auth: {}, data: data };
        this.logger.debug("info",param);
        if(CONTENT_SECURITY_POLICY!="") {
            res.header("Content-Security-Policy", CONTENT_SECURITY_POLICY);
        }
        res.render('pages/main',param);
    }
    
}
