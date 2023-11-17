import { Service } from "moleculer";
import { KnModel } from "@willsofts/will-db";
import { Utilities } from '@willsofts/will-util';
import { KnContextInfo } from '../models/KnCoreAlias';
import { KnLabelConfig } from '../utils/KnLabelConfig';
import { KnResponser } from "../utils/KnResponser";
import { KnPageRender } from '../utils/KnPageRender';
import { TknProcessHandler } from "./TknProcessHandler";
import { TknAssureRouter } from "../routers/TknAssureRouter";
import path from 'path';
import fs from 'fs';

export class TknHtmlHandler extends TknProcessHandler{
    public model : KnModel = { name: "thtml", alias: { privateAlias: this.section } };
    public dir: string = process.cwd();
    public program?: string;
    public subprog?: string;

    public override async doView(ctx: KnContextInfo, model: KnModel = this.model) : Promise<any> {
        let router = new TknAssureRouter(this.service as Service, this.dir);
        let dir = router.dir;
        let program = this.program || ctx.params.program;
        let subprog = this.subprog || ctx.params.subprog;
        let info = router.getMetaInfo(ctx);
        this.logger.debug(this.constructor.name+".doView: meta="+info);
        let workdir = Utilities.getWorkingDir(dir); 
        this.logger.debug(this.constructor.name+".doView: workdir="+workdir);
        let progpath = path.join(workdir, "views", program);
        let foundview = fs.existsSync(progpath);
        this.logger.debug(this.constructor.name+".doView: program="+program+", sub="+subprog+", found="+foundview+", path="+progpath);
        let opername = program;
        if(subprog && subprog.trim().length>0) opername = subprog;
        if (foundview) {
            let operpath = path.join(dir, program, opername+".js");
            let foundoper = fs.existsSync(operpath);
            if(!foundoper) {
                operpath = path.join(dir, program, opername+".ts");
                foundoper = fs.existsSync(operpath);
            }
            this.logger.debug(this.constructor.name+".doView: operator="+operpath+", found="+foundoper);
            let rs = null;
            let handler = null;
            if(foundoper) {
                try {
                    let action = "execute";
                    if(ctx.params.action && ctx.params.action!="") action = ctx.params.action;
                    let appname = path.join(dir, program, opername);
                    handler = require(appname);
                    handler.logger = this.logger;
                    rs = await handler[action](ctx);
                    this.logger.debug(this.constructor.name+".doView: "+program+"/"+opername+", "+action+"=", rs);
                } catch(ex) {
                    this.logger.error(this.constructor.name+".doView: error",ex);
                    if("true"==ctx.params.ajax) {
                        let response = KnResponser.createError("html",opername,ex);
                        return JSON.stringify(response);
                    }
                    return this.buildHtml("/views/pages/error", {error: ex, meta: info}, ctx);
                }
                if(rs?.error) {
                    this.logger.error(this.constructor.name+".doView: error",rs.error);
                    if("true"==ctx.params.ajax) {
                        let response = KnResponser.createError("html",opername,rs.error);
                        return JSON.stringify(response);
                    }
                    let errorpage = rs?.renderer?rs.renderer:"pages/error";
                    return this.buildHtml("/views/"+errorpage, {error: rs.error, meta: info}, ctx);
                }
            }
            let renderpage = program+"/"+program;
            if(subprog) {                
                if(subprog.trim().length>0) renderpage = program+"/"+subprog;
            }
            if(rs && rs.renderer) renderpage = rs.renderer;
            let label = new KnLabelConfig(program, info.language);
            try { await label.load(workdir); } catch(ex) { this.logger.error(this.constructor.name+".doView: error",ex); }
            let page = new KnPageRender(program, ctx, label, handler, rs);
            let param = { meta: info, page: page, label: label, data: rs };
            return this.buildHtml("/views/"+renderpage, param, ctx);
        } else {
            return this.buildHtml("/views/pages/notfound", {error: "not found", meta: info}, ctx);
        }
    }

}
