import { v4 as uuid } from 'uuid';
import { KnModel, KnOperation, KnTrackingInfo } from "@willsofts/will-db";
import { KnResultSet, KnSQLInterface, KnDBConnector } from '@willsofts/will-sql';
import { Utilities } from "@willsofts/will-util";
import { KnUtility } from "../utils/KnUtility";
import { TknSchemeHandler } from "./TknSchemeHandler";
import { DB_TRACKER } from "../utils/EnvironmentVariable";
import { KnContextInfo, KnTrailerInfo, KnTrailingInfo } from "../models/KnCoreAlias";

export class TknTrailingHandler extends TknSchemeHandler {
    public model : KnModel = { 
        name: "trxlog", 
        alias: { privateAlias: DB_TRACKER }, 
        fields: {
            keyid: { type: "STRING", key: true },
            curtime: { type: "BIGINT", created: true },
            trxtime: { type: "BIGINT", created: true },
            editdate: { type: "DATE", created: true, updated: true },
            edittime: { type: "TIME", created: true, updated: true },
            transtime: { type: "DATETIME", created: true },
            caller: { type: "STRING" },
            sender: { type: "STRING" },
            owner: { type: "STRING" },
            processtype: { type: "STRING" },
            trxstatus: { type: "STRING" },
            attachs: { type: "STRING" },
            refer: { type: "STRING" },
            note: { type: "STRING" },
            package: { type: "STRING" },
            grouper: { type: "STRING" },
            action: { type: "STRING" },
            quotable: { type: "STRING" },
            remark: { type: "STRING" },
            contents: { type: "STRING" }
        },
    };
    public trailInfo? : KnTrailingInfo;

    protected override async assignParameters(context: KnContextInfo, sql: KnSQLInterface, action?: string, mode?: string) {
        let now = Utilities.now();
        if(KnOperation.CREATE==action) {
            sql.set("curtime",now.getTime());
            sql.set("transtime",now,"DATETIME");
        }
        sql.set("editdate",now,"DATE");
        sql.set("edittime",now,"TIME");
    }
        
    protected override async doUpdate(context: KnContextInfo, model: KnModel) : Promise<KnResultSet> {
        return this.doUpdating(context, model);
    }

    public createKey() : string {
        return uuid();
    }

    public createTrailingInfo(data?: any) : KnTrailingInfo {
        let keyid = this.createKey();
        let trxtime = data?.trxtime || Utilities.now().getTime();
        this.trailInfo = {
            keyid: data?.keyid || keyid,
            trxtime: trxtime,
            owner: data?.owner,
            sender: data?.sender,
            processtype: data?.processtype,
            trxstatus: data?.trxstatus || "N",
            quotable: data?.quotable,
            contents: data?.contents,
            caller: data?.caller,
            refer: data?.refer,
            note: data?.note,
            package: data?.package,
            action: data?.action,
            attachs: data?.attachs,
            remark: data?.remark,
            grouper: data?.grouper || keyid,
        };
        return this.trailInfo;
    }

    public composeTrailerInfo(info: KnTrailingInfo) : KnTrailerInfo {
        return { 
            keyid: info?.keyid,
            trxtime: info?.trxtime,
            processtype: info?.processtype,
            trxstatus: info?.trxstatus,
            quotable: info?.quotable,
            refer: info?.refer,
            package: info?.package,
            grouper: info?.grouper,
        };
    }

    public override track(context: KnContextInfo, info: KnTrackingInfo): Promise<void> {
        //ignore tracking this handler
        return Promise.resolve();
    }

    public override async doInsert(context: any, model: KnModel) : Promise<KnTrailerInfo> {
        let info = await this.createTracking(context, model);
        return await this.createCipherData(context, KnOperation.INSERT, this.composeTrailerInfo(info));
    }

    public override async doCreate(context: KnContextInfo, model: KnModel) : Promise<KnTrailingInfo> {
        let info = await this.createTracking(context, model);
        return await this.createCipherData(context, KnOperation.CREATE, info);
    }

    public async createTracking(context: KnContextInfo, model: KnModel) : Promise<KnTrailingInfo> {
        await this.doCreating(context, model);
        return this.trailInfo as KnTrailingInfo;
    }

    public override async performCreating(context: any, model: KnModel, db: KnDBConnector): Promise<KnResultSet> {
        let userToken = await this.getUserTokenInfo(context, true);
        let info = this.trailInfo;
        if(!info) info = this.createTrailingInfo(context.params);
        info.caller = info.caller || userToken?.userid;
        context.params = {...context.params, ...info};
        return super.performCreating(context, model, db);
    }

    public async updateTracking(context: KnContextInfo, info: KnTrailerInfo) : Promise<KnResultSet> {
        context.params = {...context.params, ...info};
        KnUtility.removeAttributes(context.params,"trxtime","sender","owner","processtype","quotable","contents","caller","grouper");
        return this.doUpdating(context, this.model);
    }
    
}