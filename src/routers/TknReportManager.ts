import { Application, Request, Response } from 'express';
import { TknBaseRouter } from "./TknBaseRouter";
import { TknReportRouter } from './TknReportRouter';

export class TknReportManager extends TknBaseRouter {

    public async route(app: Application, dir?: string) {
        if(dir) this.dir = dir;
        let reporter = new TknReportRouter(this.service, this.dir);
        
        app.get("/report/:program/:subprog?/:type?", (req: Request, res: Response) => { reporter.doReport(req,res); });
        app.post("/report/:program/:subprog?/:type?", (req: Request, res: Response) => { reporter.doReport(req,res); });

    }

}
