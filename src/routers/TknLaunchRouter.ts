import { Request, Response } from 'express';
import { Utilities } from '@willsofts/will-util';
import { KnLabelConfig } from '../utils/KnLabelConfig';
import { KnResponser } from "../utils/KnResponser";
import { TknProgramHandler } from "../handlers/TknProgramHandler";
import { KnPageRender } from '../utils/KnPageRender';
import { TknAssureRouter } from './TknAssureRouter';
import path from 'path';
import fs from 'fs';

export class TknLaunchRouter extends TknAssureRouter {

    public async isValidateLauncher(req: Request, res: Response, ctx: any) : Promise<boolean> {
        //client need to send parameter authtoken when launch
        try {
            await this.validateLauncher(ctx);
        } catch(ex) {
            this.logger.error(this.constructor.name+".isValidateLauncher: error",ex);
            let info = this.getMetaInfo(ctx);
            res.render("pages/error",{error: ex, meta: info});
            return false;
        }
        return true;
    }

    public async doLaunch(req: Request, res: Response) {
        this.logger.debug(this.constructor.name+".doLaunch: url",req.originalUrl);
        let ctx = await this.createContext(req, req.params.program);
        let valid = await this.isValidateLauncher(req,res,ctx);
        if(!valid) return;
        let program = ctx.params.program;
        let subprog = ctx.params.subprog;
        let info = this.getMetaInfo(ctx);
        let workdir = Utilities.getWorkingDir(this.dir); 
        let progpath = path.join(workdir, "views", program);
        let foundview = fs.existsSync(progpath);
        this.logger.debug(this.constructor.name+".doLaunch: program="+program+", sub="+subprog+", found="+foundview+", path="+progpath);
        let label = null;
        let opername = program;
        if(subprog && subprog.trim().length>0) opername = subprog;
        if (foundview) {
            delete req.params.program;
            let operpath = path.join(this.dir, program, opername+".js");
            let foundoper = fs.existsSync(operpath);
            if(!foundoper) {
                operpath = path.join(this.dir, program, opername+".ts");
                foundoper = fs.existsSync(operpath);
            }
            this.logger.debug(this.constructor.name+".doLaunch: operator="+operpath+", found="+foundoper);
            let rs = null;
            let handler = null;
            if(foundoper) {
                try {
                    let action = "execute";
                    if(ctx.params.action && ctx.params.action!="") action = ctx.params.action;
                    let appname = path.join(this.dir, program, opername);
                    handler = require(appname);
                    handler.logger = this.logger;
                    rs = await handler[action](ctx);
                    this.logger.debug(this.constructor.name+".doLaunch: "+program+"/"+opername+", "+action+"=", rs);
                } catch(ex) {
                    this.logger.error(this.constructor.name+".doLaunch: error",ex);
                    if("true"==ctx.params.ajax) {
                        KnResponser.responseError(res,ex,"launch",opername);
                        return;
                    }
                    res.render("pages/error",{error: ex, meta: info});
                    return;
                }
                if(rs?.error) {
                    this.logger.error(this.constructor.name+".doLaunch: error",rs.error);
                    if("true"==ctx.params.ajax) {
                        KnResponser.responseError(res,rs.error,"launch",opername);
                        return;
                    }
                    let errorpage = rs?.renderer?rs.renderer:"pages/error";
                    res.render(errorpage,{error: rs.error, meta: info});
                    return;
                }
            }
            let renderpage = program+"/"+program;
            if(subprog) {                
                delete req.params.subprog;
                if(subprog.trim().length>0) renderpage = program+"/"+subprog;
            }
            if(rs && rs.renderer) renderpage = rs.renderer;
            label = new KnLabelConfig(program, info.language);
            try { await label.load(workdir); } catch(ex) { this.logger.error(this.constructor.name+".doLaunch: error",ex); }
            let page = new KnPageRender(program, ctx, label, handler, rs);
            let param = { meta: info, page: page, label: label, data: rs };
            res.render(renderpage, param, (err: Error, html: string) => {
                if(err) {
                    this.logger.error(this.constructor.name+"doLaunch: error", err); 
                    res.render("pages/error",{error: err, meta: info});
                    return;
                }
                res.send(html);
            });
        } else {
            if(!label) {
                label = new KnLabelConfig("index", info.language);
                try { await label.load(workdir); } catch(ex) { this.logger.error(this.constructor.name+".doOpen: error",ex); }
            }
            res.render("pages/notfound",{error: "not found", meta: info, label: label});
        }
    }
    
    public async doLoad(req: Request, res: Response) {
        this.logger.debug(this.constructor.name+".doLoad: url="+req.originalUrl);
        let ctx = null;
        let info = null;
        let program = req.params.program;
        if(program) {
            try {
                ctx = await this.createContext(req, program);
                info = this.getMetaInfo(ctx);
                let handelr = new TknProgramHandler();
                let ds = await handelr.getDataSource(ctx);
                this.logger.debug(this.constructor.name+".doLoad: program="+program,ds);
                if(ds) {
                    res.render("program/load",{meta: info, data: ds});
                    return;
                }
            } catch(ex: any) {
                this.logger.error(this.constructor.name+".doLoad: error",ex);
                if(!info || !ctx) {
                    ctx = this.buildContext(req);
                    info = this.getMetaInfo(ctx);
                }
                res.render("pages/error",{error: ex, meta: info});
            }
            return;
        }
        if(!info || !ctx) {
            ctx = this.buildContext(req);
            info = this.getMetaInfo(ctx);
        }
        let workdir = Utilities.getWorkingDir(this.dir); 
        let label = new KnLabelConfig("index", info.language);
        try { await label.load(workdir); } catch(ex) { this.logger.error(this.constructor.name+".doOpen: error",ex); }        
        res.render("pages/notfound",{error: "not found", meta: info, label: label});
    }

    public async doOpen(req: Request, res: Response) {
        this.logger.debug(this.constructor.name+".doOpen: url="+req.originalUrl);
        let label = null;
        let ctx = null;
        let info = null;
        let workdir = null;
        let program = req.params.program;
        let subprog = req.params.subprog;
        if(program) {
            let pager = program;
            if(subprog && subprog.trim().length>0) pager += "/"+subprog;
            workdir = Utilities.getWorkingDir(this.dir); 
            ctx = await this.createContext(req,program);
            info = this.getMetaInfo(ctx);
            label = new KnLabelConfig(program, info.language);
            try { await label.load(workdir); } catch(ex) { this.logger.error(this.constructor.name+".doOpen: error",ex); }
            let page = new KnPageRender(program, ctx, label);
            let param = { meta: info, page: page, label: label, data: {} };
            res.render(pager,param);
            return;
        }
        if(!info || !ctx) {
            let ctx = this.buildContext(req);
            info = this.getMetaInfo(ctx);
        }
        if(!label) {
            if(!workdir) workdir = Utilities.getWorkingDir(this.dir); 
            label = new KnLabelConfig("index", info.language);
            try { await label.load(workdir); } catch(ex) { this.logger.error(this.constructor.name+".doOpen: error",ex); }
        }
        res.render("pages/notfound",{error: "not found", meta: info, label: label});
    }

}
