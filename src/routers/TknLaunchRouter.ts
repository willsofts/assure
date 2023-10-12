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
            this.logger.error("error",ex);
            res.render("pages/error",{error: ex});
            return false;
        }
        return true;
    }

    public async doLaunch(req: Request, res: Response) {
        this.logger.debug(this.constructor.name+".doLaunch: url",req.originalUrl);
        let program = req.params.program;
        let subprog = req.params.subprog;
        let ctx = await this.createContext(req, program);
        let valid = await this.isValidateLauncher(req,res,ctx);
        if(!valid) return;
        let info = this.getMetaInfo(ctx);
        let workdir = Utilities.getWorkingDir(this.dir); 
        let progpath = path.join(workdir, "views", program);
        let foundview = fs.existsSync(progpath);
        this.logger.debug(this.constructor.name+".doLaunch: program="+program+", sub="+subprog+", found="+foundview+", path="+progpath);
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
                    this.logger.error("error",ex);
                    if("true"==ctx.params.ajax) {
                        KnResponser.responseError(res,ex,"launch",opername);
                        return;
                    }
                    res.render("pages/error",{error: ex});
                    return;
                }
                if(rs?.error) {
                    this.logger.error("error",rs.error);
                    if("true"==ctx.params.ajax) {
                        KnResponser.responseError(res,rs.error,"launch",opername);
                        return;
                    }
                    let errorpage = rs?.renderer?rs.renderer:"pages/error";
                    res.render(errorpage,{error: rs.error});
                    return;
                }
            }
            let renderpage = program+"/"+program;
            if(subprog) {                
                delete req.params.subprog;
                if(subprog.trim().length>0) renderpage = program+"/"+subprog;
            }
            if(rs && rs.renderer) renderpage = rs.renderer;
            let label = new KnLabelConfig(program, info.language);
            try { await label.load(workdir); } catch(ex) { this.logger.error("error",ex); }
            let page = new KnPageRender(program, ctx, label, handler, rs);
            let param = { meta: info, page: page, label: label, data: rs };
            res.render(renderpage, param, (err: Error, html: string) => {
                if(err) {
                    this.logger.error("error", err); 
                    res.render("pages/error",{error: err});
                    return;
                }
                res.send(html);
            });
        } else {
            res.render("pages/notfound",{error: "not found"});
        }
    }
    
    public async doLoad(req: Request, res: Response) {
        this.logger.debug(this.constructor.name+".doLoad: url="+req.originalUrl);
        let program = req.params.program;
        if(program) {
            try {
                let ctx = await this.createContext(req, program);
                let info = this.getMetaInfo(ctx);
                let handelr = new TknProgramHandler();
                let ds = await handelr.getDataSource(ctx);
                this.logger.debug(this.constructor.name+".doLoad: program="+program,ds);
                if(ds) {
                    res.render("program/load",{meta: info, data: ds});
                    return;
                }
            } catch(ex: any) {
                this.logger.error("error",ex);
                res.render("pages/error",{error: ex});
            }
            return;
        }
        res.render("pages/notfound",{error: "not found"});
    }

    public async doOpen(req: Request, res: Response) {
        this.logger.debug(this.constructor.name+".doOpen: url="+req.originalUrl);
        let program = req.params.program;
        let subprog = req.params.subprog;
        if(program) {
            let pager = program;
            if(subprog && subprog.trim().length>0) pager += "/"+subprog;
            let workdir = Utilities.getWorkingDir(this.dir); 
            let ctx = await this.createContext(req,program);
            let info = this.getMetaInfo(ctx);
            let label = new KnLabelConfig(program, info.language);
            try { await label.load(workdir); } catch(ex) { this.logger.error("error",ex); }
            let page = new KnPageRender(program, ctx, label);
            let param = { meta: info, page: page, label: label, data: {} };
            res.render(pager,param);
            return;
        }
        res.render("pages/notfound",{error: "not found"});
    }

}
