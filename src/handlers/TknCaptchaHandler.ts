import { KnModel } from "@willsofts/will-db";
import { HTTP } from "@willsofts/will-api";
import { CaptchaLibrary } from "@willsofts/will-lib";
import { KnRecordSet } from "@willsofts/will-sql";
import { VerifyError } from "../models/VerifyError";
import { KnContextInfo } from '../models/KnCoreAlias';
import { TknSchemeHandler } from "./TknSchemeHandler";

export class TknCaptchaHandler extends TknSchemeHandler {

    public model : KnModel = { name: "tcaptcha", alias: { privateAlias: this.section } };

    //declared addon actions name
    public handlers = [ {name: "verify"} ];

    public async verify(context: KnContextInfo) : Promise<KnRecordSet> {
        return this.callFunctional(context, {operate: "verify", raw: false}, this.doVerify);
    }

    protected override async doCreate(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        let pcapid = context.params.capid as string;
        let db = this.getPrivateConnector(model);
        try {
            let caplib : CaptchaLibrary = new CaptchaLibrary();
            let cap = await caplib.createCaptcha(db, pcapid);
            return {records: 1, rows: {id: cap.id, src: cap.src}, columns: null};
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

    protected async doVerify(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        let pcapid = context.params.capid;
        let panswer = context.params.answer;
        if((!pcapid || pcapid.trim().length==0) || (!panswer || panswer.trim().length==0)) {
            return Promise.reject(new VerifyError("Parameters is undefined",HTTP.NOT_ACCEPTABLE,-16020));
        }
        let db = this.getPrivateConnector(model);
        try {
            let caplib : CaptchaLibrary = new CaptchaLibrary();
            let result = await caplib.verifyCaptcha(db, pcapid, panswer);
            return {records: 1, rows: { result: result }, columns: null};
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

}
