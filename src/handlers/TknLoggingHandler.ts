import { KnModel, KnTrackingInfo } from "@willsofts/will-db";
import { KnRecordSet, KnResultSet, KnSQL } from '@willsofts/will-sql';
import { Utilities } from "@willsofts/will-util";
import { TknBaseHandler } from "./TknBaseHandler";
import { DB_TRACKER } from "../utils/EnvironmentVariable";
import { KnUtility } from "../utils/KnUtility";

export class TknLoggingHandler extends TknBaseHandler {
    public model : KnModel = { name: "tul", alias: { privateAlias: DB_TRACKER } };
    public trackInfo? : KnTrackingInfo;

    public override insert(context: any) : Promise<KnResultSet> {
        if(this.model && this.isValidModelConfig("privateAlias",this.model)) {
            //do not call exposeFunctional or track otherwise it circular tracking
            return this.doInsert(context, this.model);
        }
        return Promise.resolve({rows: null, columns: null});
    }
        
    protected override async doInsert(context: any, model: KnModel) : Promise<KnRecordSet> {
        let db = this.getPrivateConnector(model);
        try {
            let info = this.trackInfo;
            if(!info) info = context.params?.info;
            let user = await this.getUserTokenInfo(context,true);
            let token = this.getTokenKey(context);
            let headers = context.meta.headers;
            let params = { ...context.params };
            delete params.req;
            delete params.res;
            delete params.info;
            let binfo = KnUtility.scrapeTraceInfo(context);
            let sql = new KnSQL("insert into tul (seqno,curtime,useralias,userid,site,progid,handler,action,remark,token,address,paths,headers,requests,contents) ");
            sql.append("values(?seqno,?curtime,?useralias,?userid,?site,?progid,?handler,?action,?remark,?token,?address,?paths,?headers,?requests,?contents)");
            sql.set("seqno",Utilities.currentTimeMillis());
            sql.set("curtime",Utilities.now());
            sql.set("useralias",user?.useruuid);
            sql.set("userid",user?.userid);
            sql.set("site",user?.site);
            sql.set("progid",info?.tracker);
            sql.set("handler",info?.model);
            sql.set("action",info?.method);
            sql.set("remark",info?.remark);
            sql.set("token",token);
            sql.set("address",binfo?.ip || info?.info?.ip);
            sql.set("paths",binfo?.url || info?.info?.url);
            sql.set("headers",headers?JSON.stringify(headers):null);
            sql.set("requests",params?JSON.stringify(params):null);
            sql.set("contents",info?.info?JSON.stringify(info?.info):null);
            let rs = await sql.executeUpdate(db,context);
            return this.createRecordSet(rs);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            db.close();
        }
    }

}