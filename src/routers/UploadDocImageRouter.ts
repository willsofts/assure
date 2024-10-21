import path from 'path';
import { Request, Response } from 'express';
import { Utilities } from '@willsofts/will-util';
import { TknUploadRouter } from "./TknUploadRouter";

/**
 * This class implements for handle upload documents image for tinymce editor
 */
export class UploadDocImageRouter extends TknUploadRouter {

	public override getUploadPath() : string {
		let parent = Utilities.getWorkingDir(this.dir);
		let publicpath = path.join(parent,"public","uploaded","docimages");
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
		//tinymce upload handler need response attribute location point to image url 
		let fileurl = "uploaded/docimages/"+req.file?.filename;
		let response = { file : req.file, url: fileurl, location: req.file?.filename };
		res.end(JSON.stringify(response));
	}

}

//ex. curl -X POST http://localhost:8080/upload/docimage -F filename=@D:\images\birth.png -F type=IMG
/*
{
	"file":{"fieldname":"filename","originalname":"birth.png","encoding":"7bit","mimetype":"image/png","destination":"D:\\node\\willsofts\\assure\\public\\uploaded\\images","filename":"a5018302-8ab5-406e-89b8-ce5ca928e24b.png","path":"D:\\node\\willsofts\\assure\\public\\uploaded\\images\\a5018302-8ab5-406e-89b8-ce5ca928e24b.png","size":10717},
	"url":"uploaded/images/a5018302-8ab5-406e-89b8-ce5ca928e24b.png",
	"location":"a5018302-8ab5-406e-89b8-ce5ca928e24b.png"	
}
*/
