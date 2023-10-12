import { Application, Request, Response } from 'express';
import { Utilities } from '@willsofts/will-util';
import { TknBaseRouter } from './TknBaseRouter';
import { TknUploadRouter } from "./TknUploadRouter";
import { TknRenderRouter} from "./TknRenderRouter";
import { TknLaunchRouter } from "./TknLaunchRouter";
import { TknControlRouter } from './TknControlRouter';

export class TknRouteManager extends TknBaseRouter {

    private doHome(req: Request, res: Response,) {
        this.logger.debug('working '+this.dir+' - send /public/home.html');
        let parent = Utilities.getWorkingDir(this.dir); 
        this.logger.debug("parent path : "+parent);
        res.sendFile(parent + '/public/home.html');        
    }

    private doWelcome(req: Request, res: Response) {
        this.logger.debug('working '+this.dir+' - send /public/welcome.html');
        let parent = Utilities.getWorkingDir(this.dir as string); 
        this.logger.debug("parent path : "+parent);
        res.sendFile(parent + '/public/welcome.html');
    }    

    public route(app: Application, dir?: string) {
        if(dir) this.dir = dir;
        let render = new TknRenderRouter(this.service, this.dir);
        let uploader = new TknUploadRouter(this.service, this.dir);
        let launcher = new TknLaunchRouter(this.service, this.dir);
        let controler = new TknControlRouter(this.service, this.dir);

        app.use(async (req: Request, res: Response, next: Function) => {
            try {
                this.logger.debug(this.constructor.name+".route: headers",req.headers);
                //let ctx = await this.createContext(req);
                //await AssureHandler.doAuthorize(ctx);
            } catch(ex) { }
            next();
        });

        app.get('/home', (req: Request, res: Response) => { this.doHome(req,res); });  
        app.get('/welcome', (req: Request, res: Response) => { this.doWelcome(req,res); });  
        
        app.get("/", (req: Request, res: Response) => { render.doMain(req,res); });
        app.get('/main', (req: Request, res: Response) => { render.doMain(req,res); });
        app.get('/login', (req: Request, res: Response) => { render.doLogin(req,res); });
        app.get("/gui/:program/:subprog?", (req: Request, res: Response) => { launcher.doLaunch(req,res); });
        app.post("/gui/:program/:subprog?", (req: Request, res: Response) => { launcher.doLaunch(req,res); });
        app.get("/load/:program", (req: Request, res: Response) => { launcher.doLoad(req,res); });
        app.post("/load/:program", (req: Request, res: Response) => { launcher.doLoad(req,res); });
        app.get("/open/:program/:subprog?", (req: Request, res: Response) => { launcher.doOpen(req,res); });
        app.post("/open/:program/:subprog?", (req: Request, res: Response) => { launcher.doOpen(req,res); });
        app.get("/control/:program/:id", (req: Request, res: Response) => { controler.doLaunch(req,res); });
        app.post("/control/:program/:id", (req: Request, res: Response) => { controler.doLaunch(req,res); });
        app.post("/upload/file", async (req: Request, res: Response) => { 
            let valid = await this.verifyToken(req,res); if(!valid) return; 
            uploader.doUpload(req,res); 
        });

        // curl -X POST http://localhost:8080/upload/file -F filename=@D:\images\birth.png -F type=IMG

    }
}