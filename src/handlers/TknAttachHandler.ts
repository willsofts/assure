import { v4 as uuid } from 'uuid';
import { KnModel, KnSetting } from "@willsofts/will-db";
import { KnSQL, KnRecordSet, KnDBConnector } from '@willsofts/will-sql';
import { HTTP } from "@willsofts/will-api";
import { VerifyError } from "../models/VerifyError";
import { KnContextInfo } from '../models/KnCoreAlias';
import { TknSchemeHandler } from "./TknSchemeHandler";
import fs from "fs";

export class TknAttachHandler extends TknSchemeHandler {
    public model : KnModel = { name: "tattachfile", alias: { privateAlias: this.section } };
    public settings: KnSetting = { rowsPerPage: 20, maxRowsPerPage: 100, maxLimit: 10, disableColumnSchema: true, disablePageOffset: true, disableQueryPaging: true };
    //declared addon actions name
    public handlers = [ {name: "get"}, {name: "attach"} ];

    public async get(context: KnContextInfo) : Promise<KnRecordSet> {
        return this.callFunctional(context, {operate: "get", raw: false}, this.doGet);
    }

    public async attach(context: KnContextInfo) : Promise<KnRecordSet> {
        return this.callFunctional(context, {operate: "attach", raw: false}, this.doAttach);
    }

    public async getAttachInfo(attachid: string, context?: KnContextInfo, model: KnModel = this.model) : Promise<KnRecordSet> {
        this.logger.debug(this.constructor.name+".getAttachInfo: id="+attachid);
        if(!attachid || attachid.trim().length==0) {
            return Promise.reject(new VerifyError("Attach id is undefined",HTTP.NOT_ACCEPTABLE,-16010));
        }
        let db = this.getPrivateConnector(model);
        try {
            return await this.getAttachRecord(attachid,db,context,model);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

    public async getAttachRecord(attachid: string, db: KnDBConnector, context?: KnContextInfo, model: KnModel = this.model) : Promise<KnRecordSet> {
        if(!attachid || attachid.trim().length==0) {
            return this.createRecordSet();
        }
        let sql = new KnSQL("select * from tattachfile ");
        sql.append("where attachid = ?attachid ");
        sql.set("attachid",attachid);
        this.logger.info(this.constructor.name+".getAttachRecord",sql);
        let rs = await sql.executeQuery(db,context);
        return this.createRecordSet(rs);
    }

    public async removeAttach(attachid: string, model: KnModel = this.model) : Promise<KnRecordSet> {
        this.logger.debug(this.constructor.name+".removeAttach: id="+attachid);
        if(!attachid || attachid.trim().length==0) {
            return Promise.reject(new VerifyError("Attach id is undefined",HTTP.NOT_ACCEPTABLE,-16010));
        }
        let db = this.getPrivateConnector(model);
        try {
            let sql = new KnSQL("delete from tattachfile ");
            sql.append("where attachid = ?attachid ");
            sql.set("attachid",attachid);
            this.logger.info(this.constructor.name+".removeAttach",sql);
            let rs = await sql.executeUpdate(db);
            return this.createRecordSet(rs);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

    public async removeAttachNo(attachno: string, model: KnModel = this.model) : Promise<KnRecordSet> {
        this.logger.debug(this.constructor.name+".removeAttach: no="+attachno);
        if(!attachno || attachno.trim().length==0) {
            return Promise.reject(new VerifyError("Attach no is undefined",HTTP.NOT_ACCEPTABLE,-16010));
        }
        let db = this.getPrivateConnector(model);
        try {
            let sql = new KnSQL("delete from tattachfile ");
            sql.append("where attachno = ?attachno ");
            sql.set("attachno",attachno);
            this.logger.info(this.constructor.name+".removeAttach",sql);
            let rs = await sql.executeUpdate(db);
            return this.createRecordSet(rs);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

    protected async doGet(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        return this.getAttachInfo(context.params.id as string,context,model);
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
            let attachgroup = context.params.group as string;
            this.logger.debug(this.constructor.name+".doAttach: id="+attachid+", type="+attachtype+", no="+attachno+", group="+attachgroup);
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
            if(attachgroup && attachgroup.trim().length > 0) {
                sql.append(", attachgroup = ?attachgroup ");
                sql.set("attachgroup",attachgroup);                
            }
            if(attachtype && attachtype.trim().length > 0) {
                sql.append(", attachtype = ?attachtype ");
                sql.set("attachtype",attachtype);
            }
            if(attachno && attachno.trim().length > 0) {
                sql.append(", attachno = ?attachno ");
                sql.set("attachno",attachno);
            }
            if(attachuser && attachuser.trim().length > 0) {
                sql.append(", attachuser = ?attachuser ");
                sql.set("attachuser",attachuser);
            }
            sql.append(", mimetype = ?mimetype, attachpath = ?attachpath , ");
            sql.append("attachsize = ?attachsize, attachstream = ?attachstream ");
            sql.append("where attachid = ?attachid ");
            sql.set("attachfile",file.filename);
            sql.set("sourcefile",file.originalname);
            sql.set("attachdate",now,"DATE");
            sql.set("attachtime",now,"TIME");
            sql.set("attachmillis",now.getTime());
            sql.set("mimetype",file.mimetype);
            sql.set("attachpath",file.path);
            sql.set("attachsize",file.size);
            sql.set("attachstream",stream);
            sql.set("attachid",attachid);
            let rs = await sql.executeUpdate(db,context);
            if(rs.rows.affectedRows==0) {
                if(!attachno || attachno.trim().length==0) attachno = attachid;
                if(!attachtype || attachtype.trim().length==0) attachtype = "NONE";
                if(!attachgroup || attachgroup.trim().length == 0) attachgroup = "FILE";
                sql.clear();
                sql.append("insert into tattachfile (attachid,attachno,attachtype,attachfile,sourcefile,attachdate,attachtime,");
                sql.append("attachmillis,attachuser,mimetype,attachgroup,attachpath,attachsize,attachstream) ");
                sql.append("values(?attachid,?attachno,?attachtype,?attachfile,?sourcefile,?attachdate,?attachtime,");
                sql.append("?attachmillis,?attachuser,?mimetype,?attachgroup,?attachpath,?attachsize,?attachstream) ");
                sql.set("attachid",attachid);
                sql.set("attachno",attachno);
                sql.set("attachtype",attachtype);
                sql.set("attachfile",file.filename);
                sql.set("sourcefile",file.originalname);
                sql.set("attachdate",now,"DATE");
                sql.set("attachtime",now,"TIME");
                sql.set("attachmillis",now.getTime());
                sql.set("attachuser",attachuser);
                sql.set("mimetype",file.mimetype);
                sql.set("attachgroup",attachgroup);
                sql.set("attachpath",file.path);
                sql.set("attachsize",file.size);
                sql.set("attachstream",stream);
                rs = await sql.executeUpdate(db,context);
            }
            rs.rows = { ...rs.rows, attachid: attachid, attachno: attachno, attachtype: attachtype, sourcefile: file.originalname, attachfile: file.filename, attachsize: file.size, mimetype: file.mimetype, attachgroup: attachgroup };
            return this.createRecordSet(rs);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }        
    }

    protected override async doRemove(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        let attachno = context.params.no || context.params.attachno;
        if(attachno && attachno.trim().length > 0) {
            return this.removeAttachNo(attachno,model);
        }
        let attachid = context.params.id || context.params.attachid;
        return this.removeAttach(attachid,model);
    }

    protected override async doList(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        let rs = await this.doFinding(context,model,"list");
        return this.createRecordSet(rs);
    }

}
