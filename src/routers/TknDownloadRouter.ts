import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { Request, Response } from 'express';
import { TknBaseRouter } from './TknBaseRouter';
import { DOWNLOAD_RESOURCES_PATH } from "../utils/EnvironmentVariable";

export class TknDownloadRouter extends TknBaseRouter {

	public async doDownload(req: Request, res: Response) : Promise<void> {
        let valid = await this.verifyToken(req,res); if(!valid) return; 
        let ctx = await this.createContext(req, "download");
        let filename = ctx.params.filename;
        if(filename && filename.trim().length > 0) {
            let file = path.join(DOWNLOAD_RESOURCES_PATH,filename);
            await this.performDownload(file, res);
        } else {
            res.send("Filename not specified");
        }
    }

	public async performDownload(filename: string, res: Response) : Promise<void> {
        let found = false;
        this.logger.debug(this.constructor.name+".performDownload: file=",filename);
        if(filename && filename.trim().length > 0) {
            try {
                if(fs.statSync(filename)) {
                    found = true;
                    let outname = path.basename(filename);
                    let mimetype = mime.lookup(filename);
                    if(!mimetype) mimetype = "unknown";
                    this.logger.debug(this.constructor.name+".performDownload: outname="+outname+", mimetype="+mimetype);
                    res.setHeader('Content-disposition', 'attachment; filename=' + outname);
                    if(mimetype) res.setHeader('Content-type', mimetype);
                    let filestream = fs.createReadStream(filename);
                    filestream.pipe(res);
                    return;
                };
            } catch(ex) {
                this.logger.error(ex);
            }
        }
        if(!found) {
            let name = path.basename(filename);
            res.send("File not found ("+name+")");
        }
    }

}
