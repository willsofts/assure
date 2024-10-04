import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnSQL, KnRecordSet } from '@willsofts/will-sql';
import { HTTP } from "@willsofts/will-api";
import { TknSchemeHandler } from "./TknSchemeHandler";
import { VerifyError } from "../models/VerifyError";
import { KnContextInfo, KnValidateInfo, KnDataSet } from "../models/KnCoreAlias";
import { Utilities } from "@willsofts/will-util";

export class TknPermitHandler extends TknSchemeHandler {
    public model : KnModel = { name: "tpperm", alias: { privateAlias: this.section } };
    public handlers = [ {name: "get"}, {name: "list"}, {name: "retrieve"} ];

    public defaultPermits : KnDataSet = { all: false, insert: false, retrieve: false, update: false, delete: false, import: false, export: false, launch: false, print: false};

    protected async doGet(context: KnContextInfo, model: KnModel) : Promise<KnDataSet> {
        await this.validateRequireFields(context, model, KnOperation.RETRIEVE);
        let progids = this.getParameterArray('progid',context.params);
        let rs = await this.doRetrieving(context, model, KnOperation.RETRIEVE);
        let ds : KnDataSet = {};
        const uniqueProgid = new Set<string>();
        if(rs && rs.rows.length > 0) {
            rs.rows.forEach((item:any) => { uniqueProgid.add(item.progid); });
            uniqueProgid.forEach((id:string) => { ds[id] = {}; });
            for(let row of rs.rows) {
                let dspid = ds[row.progid];
                let cv = Utilities.parseBoolean(row.permvalue);
                let pv = dspid[row.permname];
                dspid[row.permname] = pv || cv;
            }
        } 
        if(progids) {
            let progary : Array<string> = [];
            if(uniqueProgid.size > 0) { 
                progary = Array.from(uniqueProgid);
            }
            for(let id of progids) {
                let prg = progary.find((item:string) => id == item);
                if(!prg) ds[id] = Object.assign({},this.defaultPermits);
                else ds[id].launch = true; 
            }            
        }        
        return Promise.resolve(ds);
    }

    protected override async doList(context: KnContextInfo, model: KnModel) : Promise<Array<KnDataSet>> {
        let ds = await this.doGet(context,model);
        let ary : Array<KnDataSet> = [];
        for(let p in ds) {
            let dsv = ds[p];
            let permits = [];
            for(let pn in dsv) {
                permits.push({name: pn, value: dsv[pn] });
            }
            ary.push({progid: p, permits: permits});
        }
        return Promise.resolve(ary);
    }

    protected override async doRetrieve(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        await this.validateRequireFields(context, model, KnOperation.RETRIEVE);
        let rs = await this.doRetrieving(context, model, KnOperation.RETRIEVE);
        return await this.createCipherData(context, KnOperation.RETRIEVE, rs);
    }

    protected async doRetrieving(context: KnContextInfo, model: KnModel, action: string = KnOperation.RETRIEVE): Promise<KnRecordSet> {
        let userid = context.params.userid;
        if(!userid || userid.trim().length ==0) {
            let token = await this.getAuthenToken(context, false, false, false);
            if(token) { userid = token.accessor; };
        }
        let db = this.getPrivateConnector(model);
        try {
            return await this.performRetrieving(db, userid, this.getParameterArray('progid',context.params), context.params.groupid, context);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }

    public validateRequireFields(context: KnContextInfo, model: KnModel, action?: string) : Promise<KnValidateInfo> {
        let vi = this.validateParameters(context.params,"progid");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        return Promise.resolve(vi);
    }

    public async performRetrieving(db: KnDBConnector, userid: string, progids: string|string[]|undefined, groupid?: string, context?: any): Promise<KnRecordSet> {
        if(!userid || userid.trim().length==0) return this.createRecordSet();
        if(typeof progids === 'string') progids = [progids];
        if(!progids || progids.length==0) return this.createRecordSet();
        let knsql = new KnSQL();
        knsql.append("select tpperm.* from tusergrp,tpperm ");
        knsql.append("where tusergrp.userid = ?userid ");
        knsql.append("and tusergrp.groupname = tpperm.groupid ");
        if(progids.length > 1) {
            let ids = progids.map((item:string) => "'"+item+"'").join(",");
            knsql.append("AND tpperm.progid IN (").append(ids).append(") ");
        } else {
            knsql.append("AND tpperm.progid = ?progid ");
            knsql.set("progid",progids[0]);
        }
        if(groupid && groupid.trim().length > 0) {
            knsql.append("AND tpperm.groupid = ?groupid ");
            knsql.set("groupid",groupid);
        }
        knsql.set("userid",userid);
        this.logger.debug(this.constructor.name+".performRetrieving",knsql);
        let rs = await knsql.executeQuery(db,context);
        return this.createRecordSet(rs);
    }

}
