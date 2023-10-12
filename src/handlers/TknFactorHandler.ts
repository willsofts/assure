import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector } from '@willsofts/will-sql';
import { HTTP } from "@willsofts/will-api";
import { VerifyError } from "../models/VerifyError";
import { KnContextInfo, KnDataTable, KnFactorInfo, KnFactorVerifyInfo } from "../models/KnCoreAlias";
import { TknTwoFactorHandler } from "./TknTwoFactorHandler";
import { TknProcessHandler } from "./TknProcessHandler";
import { OPERATE_HANDLERS } from "../models/KnServAlias";

const qrcode = require('qrcode');

export class TknFactorHandler extends TknProcessHandler {
    public model : KnModel = { name: "tuserfactor", alias: { privateAlias: this.section } };
    public handlers = OPERATE_HANDLERS.concat([{name: "verify"}]);

    public async verify(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: KnOperation.VERIFY, raw: false}, this.doVerify);
    }

    public async doVerify(context: KnContextInfo, model: KnModel) : Promise<KnFactorVerifyInfo> {
        let handler = new TknTwoFactorHandler();
        let info = await handler.doVerify(context, handler.model);
        if(info.verified && info.delta==0) {
            handler.doConfirm(context, handler.model);
            return info;
        }
        return Promise.reject(new VerifyError("Verification code does not verified",HTTP.NOT_ALLOWED,-16009));
    }

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.getDataRetrieval(context, model);
    }

    public override async getDataRetrieval(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let userid = this.userToken?.userid;
            let info = await this.getFactorInfo(db, userid as string, true);
            if(info && info.factorfound) {
                return this.createDataTable(KnOperation.EXECUTE, info, {}, "factor/factor");
            }
            return this.createDataTable(KnOperation.EXECUTE, info, {}, "pages/notinfo");
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }
    
    public override async getDataView(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let info = await this.getFactorInfo(db, context.params.factorid, false);
            if(info && info.factorfound) {
                return this.createDataTable(KnOperation.EXECUTE, info, {}, "factor/factor_image");
            }
            return this.createDataTable(KnOperation.EXECUTE, info, {}, "pages/notinfo");
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    public async getFactorInfo(db: KnDBConnector, id: string, findByUser: boolean = true) : Promise<KnFactorInfo> {
        let handler = new TknTwoFactorHandler();
        let info = await handler.getFactorInfo(db, id, findByUser);
        this.logger.debug(this.constructor.name+".getFactorInfo:",info);
        if(info && info.factorfound) {
            info.factorimage = await this.createQRCode(info.factorurl as string);
        }
        return info;
    }

    public async createQRCode(text: string) : Promise<string> {
        return new Promise<string>((resolve, reject) => {
            qrcode.toDataURL(text, (err: any, data: any) => {
                if(err) {
                    reject(err);
                }
                resolve(data);
            });
        });                
    }

}
