import { KnModel } from "@willsofts/will-db";
import { KnDBConnector, KnSQL, KnResultSet } from '@willsofts/will-sql';
import { HTTP } from "@willsofts/will-api";
import { KnContextInfo, KnValidateInfo, KnDataSet, KnDataTable, KnDataMapRecordSetting } from '../models/KnCoreAlias';
import { VerifyError } from '../models/VerifyError';
import { KnUtility } from '../utils/KnUtility';
import { TknProcessHandler } from "./TknProcessHandler";

export class TknMenuHandler extends TknProcessHandler {
    public progid = "menu";
    public model : KnModel = { name: "tfavor", alias: { privateAlias: this.section } };
    public handlers = [ {name: "favor"}, {name: "side"}, {name: "prog"}, {name: "box"}, {name: "html"} ];

    protected override validateRequireFields(context: any, model: KnModel, action: string) : Promise<KnValidateInfo> {
        let vi = this.validateParameters(context.params,"userid");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        return Promise.resolve(vi);
    }

    protected async doFavor(context: any, model: KnModel) : Promise<KnDataTable> {
        await this.validateRequireFields(context, model, "side");
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.getFavorMenu(db, context.params.userid, context);
            let data = { action: "favor", entity: {}, dataset: this.createRecordSet(rs) };
            return await this.createCipherData(context, "favor", data);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    protected async doSide(context: any, model: KnModel) : Promise<KnDataTable> {
        await this.validateRequireFields(context, model, "side");
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.getSideBarMenu(db, context.params.userid, context);
            rs = this.createRecordSet(rs);
            let ds = this.createSideBarMenu(rs);
            let data = { action: "side", entity: {}, dataset: ds };
            return await this.createCipherData(context, "side", data);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    protected async doProg(context: any, model: KnModel) : Promise<KnDataTable> {
        await this.validateRequireFields(context, model, "prog");
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.getFavorProgram(db, context.params.userid, context);
            let setting : KnDataMapRecordSetting = {tablename: "tprog", resultset: rs, setting: { keyName: "programid", valueNames: ["shortname"], categoryName: "progcategory" }};
            let ds = KnUtility.createDataEntity([setting]);
            let data = { action: "prog", entity: {}, dataset: ds };
            return await this.createCipherData(context, "prog", data);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    protected async doBox(context: any, model: KnModel) : Promise<KnDataTable> {
        await this.validateRequireFields(context, model, "box");
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.getMenuBox(db, context.params.userid, context);
            rs = this.createRecordSet(rs);
            let data = { action: "box", entity: {}, dataset: rs };
            return await this.createCipherData(context, "box", data);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    public async favor(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: "favor", raw: false}, this.doFavor);
    }

    public async side(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: "side", raw: false}, this.doSide);
    }

    public async prog(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: "prog", raw: false}, this.doProg);
    }

    public async box(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: "box", raw: false}, this.doBox);
    }

    public getFavorMenu(db: KnDBConnector, userid: string, context?: any) : Promise<KnResultSet> {
        let knsql = new KnSQL();
        knsql.append("select tprog.programid,tprog.shortname as progname,tprog.shortnameth as prognameth,tprog.iconfile,tfavor.seqno,tprod.url ");
        knsql.append("from tfavor ");
        knsql.append("left join tprog ON tfavor.programid = tprog.programid ");
        knsql.append("left join tprod ON tprod.product = tprog.product ");
        knsql.append("where tfavor.userid = ?userid ");
        knsql.append("order by seqno ");
        knsql.set("userid",userid);
        return knsql.executeQuery(db, context);
    }

    public getFavorProgram(db: KnDBConnector, userid: string, context?: any) : Promise<KnResultSet> {
        let knsql = new KnSQL();
		knsql.append("select tprog.* ");
		knsql.append("from tprog,tproggrp,tusergrp ");
		knsql.append("where tusergrp.userid = ?userid ");
		knsql.append("and tusergrp.groupname = tproggrp.groupname ");
		knsql.append("and tproggrp.programid = tprog.programid ");
		knsql.append("order by programid ");
		knsql.set("userid", userid);
        return knsql.executeQuery(db, context);
    }

    public getSideBarMenu(db: KnDBConnector, userid: string, context?: any) : Promise<KnResultSet> {
        let knsql = new KnSQL();
        knsql.append("select tprod.url,tprod.verified,tprog.product,tprog.programid,");
        knsql.append("tprog.progname,tprog.prognameth,tprog.iconstyle,tprog.progtype,");
        knsql.append("tgroup.seqno as grpno,tgroup.groupname,tgroup.nameen,tgroup.nameth,");
        knsql.append("tgroup.iconstyle as groupstyle,tproggrp.seqno as prgno,tproggrp.parameters ");
        knsql.append("from tprod,tprog,tproggrp,tusergrp,tgroup ");
        knsql.append("where tusergrp.userid = ?userid ");
        knsql.append("and tusergrp.groupname = tproggrp.groupname ");
        knsql.append("and tproggrp.programid = tprog.programid ");
        knsql.append("and tproggrp.groupname = tgroup.groupname ");
        knsql.append("and tprog.product = tprod.product ");
        knsql.append("and tprog.appstype = 'W' ");
        knsql.append("order by grpno,groupname,prgno,programid ");
        knsql.set("userid",userid);
        return knsql.executeQuery(db, context);
    }

    public getMenuBox(db: KnDBConnector, userid: string, context?: any) : Promise<KnResultSet> {
        let eng = KnUtility.isEnglish(context);
        let knsql = new KnSQL();
		knsql.append("select tprog.programid,tprog.progname,tprog.iconfile,");
		if(eng) {
			knsql.append("tprog.shortname as shortname");
		} else {
			knsql.append("tprog.shortnameth as shortname");			
		}
		knsql.append(",tfavor.seqno,tprod.url ");
		knsql.append("from tfavor ");
		knsql.append("left join tprog ON tfavor.programid = tprog.programid ");
		knsql.append("left join tprod ON tprod.product = tprog.product ");
		knsql.append("where tfavor.userid = ?userid ");
		knsql.append("order by seqno ");
        knsql.set("userid",userid);
        return knsql.executeQuery(db, context);
    }

    public createMapMenuFavor(rs: KnResultSet) : Map<number,any> {
        let result : Map<number,any> = new Map<number,any>();
        for(let r of rs.rows) {
            result.set(Number(r.seqno),r);
        }
        return result;
    }

    public createSideBarMenu(rs: KnResultSet) : KnSideBarMenuDataSet {
        let sidemap = new Map<string,any>();
        let sidelist = new Map<string,Array<any>>();
        for(let r of rs.rows) {
            let iconstyle = r.iconstyle;
            let groupstyle = r.groupstyle;
            if(!iconstyle || iconstyle=="") r.iconstyle = "fa fa-desktop";
            if(!groupstyle || groupstyle=="") r.groupstyle = "fa fa-tasks";
            if(!sidemap.has(r.groupname)) sidemap.set(r.groupname,r);
            let list = sidelist.get(r.groupname);            
            if(!list) {
                list = new Array();
                sidelist.set(r.groupname,list);
            }
            list.push(r);
        }
        return {sidemap: Object.fromEntries(sidemap), sidelist: Object.fromEntries(sidelist)};
    }

}

export interface KnSideBarMenuDataSet {
    sidemap: KnDataSet;
    sidelist: KnDataSet;
}
