import { Application, Request, Response } from 'express';
import { TknBaseRouter } from './TknBaseRouter';
import { TknSAMLRouter } from './TknSAMLRouter';

export class TknSAMLManager extends TknBaseRouter {

    public async route(app: Application, dir?: string) {
        if(dir) this.dir = dir;
        let authener = new TknSAMLRouter(this.service, this.dir);
        
        app.get("/auth", (req: Request, res: Response, next: Function) => { authener.doAuthen(req,res,next); });
        app.get("/auth/signin/:domainid?", (req: Request, res: Response, next: Function) => { authener.doSignin(req,res,next); });
        app.post("/auth/redirect", (req: Request, res: Response, next: Function) => { authener.doRedirect(req,res,next); });
        app.get("/auth/signout", (req: Request, res: Response, next: Function) => { authener.doSignout(req,res,next); });
        app.get("/auth/acquire", (req: Request, res: Response, next: Function) => { authener.doAcquire(req,res,next); });

    }

}