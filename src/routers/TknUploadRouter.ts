import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import { Service } from "moleculer";
import { Request, Response, RequestHandler } from 'express';
import { JSONReply } from "@willsofts/will-api";
import { KnResponser } from "../utils/KnResponser";;
import { UPLOAD_RESOURCES_PATH, UPLOAD_FILE_TYPES, UPLOAD_FILE_SIZE } from "../utils/EnvironmentVariable";
import { TknAttachHandler } from '../handlers/TknAttachHandler';
import { TknBaseRouter } from './TknBaseRouter';

export class TknUploadRouter extends TknBaseRouter {
	protected fileuploader : multer.Multer;
	protected uploadfile : RequestHandler;

	constructor(service: Service, dir?: string, filePath?: string, paramname: string = "filename", fileTypes?: RegExp, fileSize?: number) {
		super(service, dir);
		this.fileuploader = this.buildMulter(filePath,fileTypes, fileSize);
		this.uploadfile = this.fileuploader.single(paramname);
    }

	public getUploadPath() : string {
		return path.join(UPLOAD_RESOURCES_PATH,"uploaded","files");;
	}
	
	protected getUploadStorage(filePath?: string) {
		let dir = this.getUploadPath();
		if(filePath && filePath.trim().length > 0)  dir = filePath;
		return multer.diskStorage({
			destination: function(req, file, cb) {
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
	}
	
	protected buildMulter(filePath?: string, fileTypes: RegExp = new RegExp(UPLOAD_FILE_TYPES,"i"), fileSize: number = UPLOAD_FILE_SIZE) : multer.Multer {
		return multer({ 
			storage: this.getUploadStorage(filePath),
			limits : { fileSize : fileSize }, 
			fileFilter:  function (req, file, cb) {    
				console.log("fileFilter:",file);
				const filetypes = fileTypes;
				const extname =  filetypes.test(path.extname(file.originalname).toLowerCase());
				const mimetype = filetypes.test(file.mimetype);
				console.log("fileFilter: extname",extname+", mimetype",mimetype);	  
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
		if(req.file) {
			req.file.originalname = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
		}
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
