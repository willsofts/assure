import { Request, Response } from 'express';
import { TknAssureRouter } from './TknAssureRouter';

export class TknRenderRouter extends TknAssureRouter {
    
    public async doLogin(req: Request, res: Response) {
        this.logger.debug(this.constructor.name+".doLogin : "+req.originalUrl);
        let ctx = await this.createContext(req);
        let info = this.getMetaInfo(ctx);
        let param = { meta : {...info, state: req.query.state, nonce: req.query.nonce } };
        this.logger.debug("info",param);
        res.render('pages/login',param);
    }

    public async doMain(req: Request, res: Response) {
        this.logger.debug(this.constructor.name+".doMain : "+req.originalUrl);
        let ctx = await this.createContext(req);
        let info = this.getMetaInfo(ctx);
        let param = { meta : {...info, state: req.query.state, nonce: req.query.nonce } };
        this.logger.debug("info",param);
        res.render('pages/main',param);
    }
    
}
