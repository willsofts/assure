import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import { Service } from "moleculer";
import { Request, Response, RequestHandler } from 'express';
import { JSONReply } from "@willsofts/will-api";
import { KnResponser } from "../utils/KnResponser";;
import { UPLOAD_RESOURCES_PATH } from "../utils/EnvironmentVariable";
import { TknAttachHandler } from '../handlers/TknAttachHandler';
import { TknBaseRouter } from './TknBaseRouter';

const buddystorage = multer.diskStorage({
	destination: function(req, file, cb) {
		let dir = path.join(UPLOAD_RESOURCES_PATH,"uploaded","files");
		if(!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		cb(null, dir);
	},  
	filename: function(req, file, cb) {
		let extension = path.extname(file.originalname);
		let fileid = uuid();
		let filename = fileid+extension;
		req.params.fileid = fileid;
		cb(null, filename.toLowerCase());
	}
});

export class TknUploadRouter extends TknBaseRouter {
	private fileuploader : multer.Multer;
	private uploadfile : RequestHandler;

    constructor(service: Service, dir?: string, paramname: string = "filename", fileTypes?: RegExp, fileSize?: number) {
		super(service, dir);
		this.fileuploader = this.buildMulter(fileTypes, fileSize);
		this.uploadfile = this.fileuploader.single(paramname);
    }

	private buildMulter(fileTypes: RegExp = /jpeg|jpg|png|pdf/, fileSize: number = 10*1024*1024) : multer.Multer {
		return multer({ 
			storage: buddystorage,
			limits : { fileSize : fileSize }, 
			fileFilter:  function (req, file, cb) {    
				console.log("fileFilter:",file);
				const filetypes = fileTypes;
				const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
				const mimetype = filetypes.test(file.mimetype);	  
				if(mimetype && extname) {
					cb(null,true);
				} else {
					cb(new Error("Invalid file type"));			
				}
			}	
		});			
	}

	public doUpload(req: Request, res: Response) : void {
		this.uploadfile(req, res, (err:any) => {
			if(err) {
				KnResponser.responseError(res,err,"upload","file");
				return;
			}
			this.doUploadFile(req, res);
		});
	}

	protected async doUploadFile(req: Request, res: Response) : Promise<void> {
		res.contentType('application/json');
		console.log(this.constructor.name+".doUploadFile: body",JSON.stringify(req.body));
		console.log(this.constructor.name+".doUploadFile: file",req.file);
		let response: JSONReply = new JSONReply();
		response.head.modeling("upload","file");
		response.head.composeNoError();
		try {
            let ctx = await this.createContext(req);
			ctx.params.file = req.file;
			let handler = new TknAttachHandler();
			let rs = await handler.attach(ctx);
			response.body = rs;
			res.end(JSON.stringify(response));
		} catch(ex) {
			KnResponser.responseError(res,ex,"upload","file");
		}
	}

}

//ex. curl -X POST http://localhost:8080/upload/file -F filename=@D:\images\birth.png -F type=IMG
/*
file {
  fieldname: 'filename',
  originalname: 'birth.png',
  encoding: '7bit',
  mimetype: 'image/png',
  destination: 'C:\\Users\\ADMIN\\AppData\\Local\\Temp\\uploaded\\files',
  filename: 'f51aa9e2-385b-4ae2-b024-2b65f1a5250b.png',
  path: 'C:\\Users\\ADMIN\\AppData\\Local\\Temp\\uploaded\\files\\f51aa9e2-385b-4ae2-b024-2b65f1a5250b.png',
  size: 10717
}
*/
