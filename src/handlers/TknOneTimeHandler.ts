import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnRecordSet, KnDBConnector } from '@willsofts/will-sql';
import { HTTP } from "@willsofts/will-api";
import { Utilities, RandomUtility } from "@willsofts/will-util";
import { VerifyError } from "../models/VerifyError";
import { KnContextInfo, KnValidateInfo, KnActivateInfo } from '../models/KnCoreAlias';
import { DEFAULT_INVALIDATE_TIMES, DEFAULT_ONETIME_LENGTH } from "../utils/EnvironmentVariable";
import { TknActivateHandler } from "./TknActivateHandler";

export class TknOneTimeHandler extends TknActivateHandler {

    public override createActivateKey() : string {
        return RandomUtility.randomNumber(DEFAULT_ONETIME_LENGTH);
    }

    public override async performInvalidating(db: KnDBConnector, info: KnActivateInfo, invalidatetimes: number = DEFAULT_INVALIDATE_TIMES): Promise<KnActivateInfo | undefined> {
        let ainfo = await super.performInvalidating(db, info, invalidatetimes);
        if(ainfo) {
            let difftimes = Utilities.now().getTime() - ainfo.transtime;
            this.logger.debug(this.constructor.name+".invalidate: difftimes="+difftimes+", invalidatetimes="+invalidatetimes);
            if(difftimes > invalidatetimes) {
                return Promise.reject(new VerifyError("Over time",HTTP.NOT_ALLOWED,-18803,"transtime"));
            }
            if("A"==ainfo.activatestatus) {
                return Promise.reject(new VerifyError("Already Activated",HTTP.NOT_ALLOWED,-18804,"activatestatus"));
            }
        }
        return ainfo;
    }

    public override validateKeyFields(context: KnContextInfo) : KnValidateInfo {
        let vi = super.validateKeyFields(context);
        if(vi.valid) {
            vi = this.validateParameters(context.params,"activateuser");
        }
        return vi;
    }

    public override async updateActivation(db: KnDBConnector, info: KnActivateInfo): Promise<KnRecordSet> {
        return await this.updateActivateByKeyAndUser(db, info);
    }

    protected override async doRemove(context: KnContextInfo, model: KnModel) : Promise<any> {
        let vi = this.validateParameters(context.params,"activatekey","activateuser");        
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        let db = this.getPrivateConnector(model);
        try {
            let rs = this.doRemoving(context, db);
            return await this.createCipherData(context, KnOperation.REMOVE, rs);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }        
    }
    
}
