import { Application, Request, Response } from 'express';
import { TknBaseRouter } from './TknBaseRouter';
import { UploadImageRouter } from "./UploadImageRouter";

export class UploadFileManager extends TknBaseRouter {

	public route(app: Application, dir?: string) {
        if(dir) this.dir = dir;
        let imager = new UploadImageRouter(this.service, this.dir);
        app.post("/upload/image", async (req: Request, res: Response) => { 
            let valid = await this.verifyToken(req,res); if(!valid) return; 
            imager.doUpload(req,res); 
        });
		
	}

}
