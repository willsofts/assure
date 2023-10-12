import { Service } from "moleculer";
import { Request, Response } from 'express';
import { KnLoggerInterface } from "@willsofts/will-db";
import { KnContextInfo } from "../models/KnCoreAlias";
import { TknAuthorizeHandler } from "../handlers/TknAuthorizeHandler";
import { TknSystemHandler } from "../handlers/TknSystemHandler";
import { TknBaseHandler } from "../handlers/TknBaseHandler";
import { KnResponser } from "../utils/KnResponser";

export abstract class TknBaseRouter {
    public readonly service: Service;
    public readonly logger: KnLoggerInterface;
    public dir: string = process.cwd();
    
    constructor(service: Service, dir?: string) {
        this.service = service;  
        this.logger = service.logger;
        if(dir) this.dir = dir;
    }
    
    public buildContext(req: Request, pid?: string) : KnContextInfo {
        let params = {};
        const body = (req.body) ? req.body : {};
        Object.assign(params, body, req.query, req.params);
        let user = undefined;
        let session = (req as any).session;
        if(session && session.user) user = session.user;        
        return {params: params, meta: { headers: req.headers, session: session, user: user, req: req, pid: pid }};
    }

    public async createContext(req: Request, pid?: string) : Promise<KnContextInfo> {
        return this.buildContext(req,pid);
        //let handler = new TknSystemHandler();
        //return await handler.exposeContext(ctx);
    }

    public async cipherData(context: KnContextInfo, data?: any, verifyHandShaked: boolean = false) : Promise<any | undefined> {
        let handler = new TknSystemHandler();
        return handler.cipherData(context, data, verifyHandShaked);
    }

    public async cipherText(context: KnContextInfo, data?: any, verifyHandShaked: boolean = false) : Promise<any | undefined> {
        let handler = new TknSystemHandler();
        return handler.cipherText(context, data, verifyHandShaked);
    }

    public async createCipherData(context: KnContextInfo, method: string, data?: any, verifyHandShaked: boolean = true, model?: string) : Promise<any> {
        let handler = new TknSystemHandler();
        return handler.createCipherData(context, method, data, verifyHandShaked, model?model:this.constructor.name);
    }

    public async call(serviceName: string, req: Request) : Promise<any> {
        let ctx = await this.createContext(req);
        return this.service.broker.call(serviceName, ctx.params, {meta: ctx.meta});
    }

    public async authorize(req: Request) : Promise<KnContextInfo> {
        let ctx = await this.createContext(req);
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
    }

    protected async verifyToken(req: Request, res: Response) : Promise<boolean> {
        try {
            return await this.verifyAuthenToken(req);
        } catch(err) {
            KnResponser.responseError(res,err,"route","verify");
            return false;
        }
    }

    protected async verifyAuthenToken(req: Request) : Promise<boolean> {
        let token = this.getAuthorizeToken(req); 
        try {
            let handler = new TknBaseHandler();
            await handler.verifyAuthenToken(token);
        } catch(err) {
            return Promise.reject(err);
        }
        return true;
    }

    protected getAuthorizeToken(req: Request) : string | undefined {
        return req.headers["authtoken"] as string || req.headers["tokenkey"] as string;
    }

}
