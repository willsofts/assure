import { Application, Request, Response } from 'express';
import { TknBaseRouter } from './TknBaseRouter';
import { UploadImageRouter } from "./UploadImageRouter";
import { UploadDocImageRouter } from "./UploadDocImageRouter";

export class UploadFileManager extends TknBaseRouter {

	public route(app: Application, dir?: string) {
        if(dir) this.dir = dir;
        let imager = new UploadImageRouter(this.service, this.dir);
        //this is upload image for tinymce handler (need file as parameter name)
        let docimager = new UploadDocImageRouter(this.service, this.dir, undefined, "file");
        app.post("/upload/image", async (req: Request, res: Response) => { 
            let valid = await this.verifyToken(req,res); if(!valid) return; 
            imager.doUpload(req,res); 
        });
        app.post("/upload/docimage", async (req: Request, res: Response) => { 
            let valid = await this.verifyToken(req,res); if(!valid) return; 
            docimager.doUpload(req,res); 
        });
		
	}

}
