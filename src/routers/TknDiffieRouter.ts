import { Request, Response } from 'express';
import { TknBaseRouter } from "./TknBaseRouter";
import { TknDiffieHandler } from "../handlers/TknDiffieHandler";

export class TknDiffieRouter extends TknBaseRouter {

    public async doDiffie(req: Request, res: Response) {
        this.logger.debug("body",req.body);
        let ctx = await this.createContext(req);
        let handler = new TknDiffieHandler();
        let body = await handler.diffie(ctx);
        let response = { body: body };
        this.logger.debug("response",response);
        res.send(JSON.stringify(response));
    }

    public async doEncrypt(req: Request, res: Response) {
        this.logger.debug("body",req.body);
        let ctx = await this.createContext(req);
        let handler = new TknDiffieHandler();
        let body = await handler.encrypt(ctx);
        let response = { body: body };
        this.logger.debug("response",response);
        res.send(JSON.stringify(response));
    }

    public async doDecrypt(req: Request, res: Response) {
        this.logger.debug("body",req.body);
        let ctx = await this.createContext(req);
        let handler = new TknDiffieHandler();
        let body = await handler.decrypt(ctx);
        let response = { body: body };
        this.logger.debug("response",response);
        res.send(JSON.stringify(response));
    }

    public async doUpdate(req: Request, res: Response) {
        this.logger.debug("body",req.body);
        let ctx = await this.createContext(req);
        let handler = new TknDiffieHandler();
        let body = await handler.update(ctx);
        let response = { body: body };
        this.logger.debug("response",response);
        res.send(JSON.stringify(response));
    }

}
