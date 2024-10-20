import path from 'path';
import { Request, Response } from 'express';
import { JSONReply } from "@willsofts/will-api";
import { Utilities } from '@willsofts/will-util';
import { TknUploadRouter } from "./TknUploadRouter";

export class UploadImageRouter extends TknUploadRouter {

	public override getUploadPath() : string {
		let parent = Utilities.getWorkingDir(this.dir);
		let publicpath = path.join(parent,"public","uploaded","images");
		console.log(this.constructor.name+".getUploadPath: dir=",this.dir," parent=",parent,"public=",publicpath);
		return publicpath;
	}

	protected override async doUploadFile(req: Request, res: Response) : Promise<void> {
		res.contentType('application/json');
		if(req.file) {
			req.file.originalname = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
		}
		console.log(this.constructor.name+".doUploadFile: body",JSON.stringify(req.body));
		console.log(this.constructor.name+".doUploadFile: file",req.file);
		let response: JSONReply = new JSONReply();
		response.head.modeling("upload","image");
		response.head.composeNoError();
		response.body = { file : req.file, url: "uploaded/images/"+req.file?.filename };
		res.end(JSON.stringify(response));
	}

}

//ex. curl -X POST http://localhost:8080/upload/image -F filename=@D:\images\birth.png -F type=IMG
/*
{
"head":{"model":"upload","method":"image","errorcode":"0","errorflag":"N","errordesc":""},
"body":{
	"file":{"fieldname":"filename","originalname":"birth.png","encoding":"7bit","mimetype":"image/png","destination":"D:\\node\\willsofts\\assure\\public\\uploaded\\images","filename":"a5018302-8ab5-406e-89b8-ce5ca928e24b.png","path":"D:\\node\\willsofts\\assure\\public\\uploaded\\images\\a5018302-8ab5-406e-89b8-ce5ca928e24b.png","size":10717},
	"url":"uploaded/images/a5018302-8ab5-406e-89b8-ce5ca928e24b.png"
	}
}
*/
