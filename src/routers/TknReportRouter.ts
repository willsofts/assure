import { Request, Response } from 'express';
import { TknAssureRouter } from './TknAssureRouter';
import { KnResponser } from "../utils/KnResponser";
import { HTTP } from "@willsofts/will-api";
import path from 'path';
import fs from 'fs';

export class TknReportRouter extends TknAssureRouter {

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

    public async doReport(req: Request, res: Response) {
        this.logger.debug(this.constructor.name+".doReport: url",req.originalUrl);
        let ctx = await this.createContext(req, req.params.program);
        let valid = await this.isValidateLauncher(req,res,ctx);
        if(!valid) return;
        let program = ctx.params.program;
        let subprog = ctx.params.subprog;
        let info = this.getMetaInfo(ctx);
        let opername = program;
        if(subprog && subprog.trim().length>0) opername = subprog;
        let operpath = path.join(this.dir, program, opername+".js");
        let foundoper = fs.existsSync(operpath);
        if(!foundoper) {
            operpath = path.join(this.dir, program, opername+".ts");
            foundoper = fs.existsSync(operpath);
        }
        this.logger.debug(this.constructor.name+".doReport: program="+program+", sub="+subprog+", operator="+operpath+", found="+foundoper);
        if(foundoper) {
            delete req.params.program;
            try {
                let action = "report";
                if(ctx.params.action && ctx.params.action!="") action = ctx.params.action;
                let appname = path.join(this.dir, program, opername);
                this.logger.debug(this.constructor.name+".doReport: appname="+appname+", action="+action);
                let handler = require(appname);
                handler.logger = this.logger;
                await handler[action](ctx,req,res);
            } catch(ex) {
                this.logger.error(this.constructor.name+".doReport: error",ex);
                if("true"==ctx.params.ajax) {
                    KnResponser.responseError(res,ex,"report",opername);
                    return;
                }
                res.render("pages/error",{error: ex, meta: info});
            }
        } else {
            res.status(HTTP.NOT_FOUND).send("Operator not found");
        }
    }

}
