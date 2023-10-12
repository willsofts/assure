import { v4 as uuid } from 'uuid';
import { KnModel } from "@willsofts/will-db";
import { KnSQL, KnRecordSet } from '@willsofts/will-sql';
import { HTTP } from "@willsofts/will-api";
import { VerifyError } from "../models/VerifyError";
import { KnContextInfo } from '../models/KnCoreAlias';
import { TknSchemeHandler } from "./TknSchemeHandler";
import fs from "fs";

export class TknAttachHandler extends TknSchemeHandler {
    public model : KnModel = { name: "tattachfile", alias: { privateAlias: this.section } };

    //declared addon actions name
    public handlers = [ {name: "get"}, {name: "attach"} ];

    public async get(context: KnContextInfo) : Promise<KnRecordSet> {
        return this.callFunctional(context, {operate: "get", raw: false}, this.doGet);
    }

    protected async doGet(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        let db = this.getPrivateConnector(model);
        try {
            let attachid = context.params.id as string;
            this.logger.debug(this.constructor.name+".doGet: id="+attachid);
            if(!attachid || attachid.trim().length==0) {
                return Promise.reject(new VerifyError("Attach id is undefined",HTTP.NOT_ACCEPTABLE,-16010));
            }
            let sql = new KnSQL("select * from tattachfile ");
            sql.append("where attachid = ?attachid ");
            sql.set("attachid",attachid);
            this.logger.info(this.constructor.name+".doGet",sql);
            let rs = await sql.executeQuery(db);
            return this.createRecordSet(rs);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

    public async attach(context: KnContextInfo) : Promise<KnRecordSet> {
        return this.callFunctional(context, {operate: "attach", raw: false}, this.doAttach);
    }

    protected async doAttach(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        let file = context.params.file;
        if(!file || !file.filename || !file.originalname) {
            return Promise.reject(new VerifyError("No attachment found",HTTP.NOT_ACCEPTABLE,-16091));
        }
        let stream = undefined;
        let existing = fs.existsSync(file.path);
        if(existing) {
            let buffer = fs.readFileSync(file.path, {flag:'r'});
            stream = buffer.toString("base64");
        }
        let db = this.getPrivateConnector(model);
        try {
            let attachid = context.params.id as string;
            let attachtype = context.params.type as string;
            let attachno = context.params.no as string;
            this.logger.debug(this.constructor.name+".doAttach: id="+attachid+", type="+attachtype+", no="+attachno);
            if(!attachid || attachid.trim().length==0) {
                attachid = context.params.fileid as string;
            }
            if(!attachid || attachid.trim().length==0) {
                attachid = uuid();
            }
            let ut = await this.getUserTokenInfo(context,true);
            let attachuser = ut?.userid;
            if(!attachuser) attachuser = this.getCurrentUser();
            let now = new Date();
            let sql = new KnSQL("update tattachfile ");
            sql.append("set attachfile = ?attachfile , ");
            sql.append("sourcefile = ?sourcefile , ");
            sql.append("attachdate = ?attachdate , ");
            sql.append("attachtime = ?attachtime , ");
            sql.append("attachmillis = ?attachmillis ");
            if(attachtype) {
                sql.append(", attachtype = ?attachtype ");
                sql.set("attachtype",attachtype);
            }
            if(attachno) {
                sql.append(", attachno = ?attachno ");
                sql.set("attachno",attachno);
            }
            if(attachuser) {
                sql.append(", attachuser = ?attachuser ");
                sql.set("attachuser",attachuser);
            }
            sql.append(", attachpath = ?attachpath , attachstream = ?attachstream ");
            sql.append("where attachid = ?attachid ");
            sql.set("attachfile",file.filename);
            sql.set("sourcefile",file.originalname);
            sql.set("attachdate",now,"DATE");
            sql.set("attachtime",now,"TIME");
            sql.set("attachmillis",now.getTime());
            sql.set("attachpath",file.path);
            sql.set("attachstream",stream);
            sql.set("attachid",attachid);
            let rs = await sql.executeUpdate(db,context);
            if(rs.rows.affectedRows==0) {
                if(!attachno || attachno.trim().length==0) attachno = attachid;
                if(!attachtype || attachtype.trim().length==0) attachtype = "NONE";
                sql.clear();
                sql.append("insert into tattachfile (attachid,attachno,attachtype,attachfile,sourcefile,attachdate,attachtime,attachmillis,attachuser,attachpath,attachstream) ");
                sql.append("values(?attachid,?attachno,?attachtype,?attachfile,?sourcefile,?attachdate,?attachtime,?attachmillis,?attachuser,?attachpath,?attachstream) ");
                sql.set("attachid",attachid);
                sql.set("attachno",attachno);
                sql.set("attachtype",attachtype);
                sql.set("attachfile",file.filename);
                sql.set("sourcefile",file.originalname);
                sql.set("attachdate",now,"DATE");
                sql.set("attachtime",now,"TIME");
                sql.set("attachmillis",now.getTime());
                sql.set("attachuser",attachuser);
                sql.set("attachpath",file.path);
                sql.set("attachstream",stream);
                rs = await sql.executeUpdate(db,context);
            }
            rs.rows = { ...rs.rows, attachid: attachid, attachno: attachno, attachtype: attachtype } ;
            return this.createRecordSet(rs);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }        
    }

}
