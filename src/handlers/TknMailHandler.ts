import { KnModel, KnTrackingInfo } from "@willsofts/will-db";
import { MailLibrary, MailInfo, MailConfig } from '@willsofts/will-lib';
import { TknSchemeHandler } from "./TknSchemeHandler";
import { KnChannel, KnContextInfo, KnMailSetting } from '../models/KnCoreAlias';
import { TknTrailingHandler } from "./TknTrailingHandler";

export class TknMailHandler extends TknSchemeHandler {
    public model : KnModel = { name: "trxlog", alias: { privateAlias: this.section } };
    public handlers = [ {name: "send"} ];
    public retry: number = 3;

    public createMailInfo(setting: KnMailSetting) : MailInfo {
        let email = "";
        if(Array.isArray(setting.target)) {
            email = setting.target.join(",");
        } else {
            email = setting.target;
        }
        return {
            email: email,
            subject: setting.subject,
            message: setting.message,
            cc: setting.options?.cc,
            bcc: setting.options?.bcc,
            attachments: setting.options?.attachments
        };
    }

    public scrapeMailInfo(data?: any) : MailInfo {
        return {
            email: data?.email,
            subject: data?.subject,
            message: data?.message,
            cc: data?.cc,
            bcc: data?.bcc,
            attachments: data?.attachments
        };
    }

    public scrapeMailSetting(data?: any) : KnMailSetting {
        let setting = {
            target: data?.target,
            subject: data?.subject,
            message: data?.message,
            channel: data?.channel || KnChannel.MAIL,
            options: data?.options || {}
        };
        if(data.hasOwnProperty("email")) {
            setting.target = data.email;
        }
        if(data.hasOwnProperty("cc")) {
            setting.options.cc = data.cc;
        }
        if(data.hasOwnProperty("bcc")) {
            setting.options.bcc = data.bcc;
        }
        if(data.hasOwnProperty("attachments")) {
            setting.options.attachments = data.attachments;
        }
        return setting;
    }

    public override async track(context: KnContextInfo, info: KnTrackingInfo): Promise<void> {
        //ignore tracking this handler
        return Promise.resolve();
    }

    public async send(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: "send", raw: false}, this.doSend);
    }

    protected async doSend(context: KnContextInfo, model: KnModel) : Promise<any> {
        let setting = this.scrapeMailSetting(context.params);
        this.logger.debug(this.constructor.name+".doSend: setting",setting);
        return this.sendMail(context, setting);
    }

    public async sendMail(context: KnContextInfo, setting: KnMailSetting) : Promise<void> {
        let info = this.createMailInfo(setting);
        this.processSendMail(context, info);
    }

	public async processSendMail(context: KnContextInfo, info: MailInfo) : Promise<void> {
        if(!info.email || info.email.trim().length==0) return;
        let cfg = null;
		let db = this.getPrivateConnector(this.model);
		try {
            cfg = await MailLibrary.getMailConfig(db);
		} catch(ex: any) {
			this.logger.error(this.constructor.name,this.constructor.name,ex);
		} finally {
			if(db) db.close();
		}
        if(cfg) {
            this.performSendMail(context, info, cfg);
        }
	}

	public async performSendMail(context: KnContextInfo, info: MailInfo, cfg: MailConfig) : Promise<void> {
        let userToken = await this.getUserTokenInfo(context, true);
        let trail = new TknTrailingHandler();
        trail.obtain(this.broker,this.logger);
        let tinfo = trail.createTrailingInfo({...context.params, processtype: "mail", caller: userToken?.userid, sender: cfg.from, owner: info.email, quotable: info.subject, contents: info.message}); 
        await trail.doCreate(context, trail.model);
        let [finished, result, error] = await this.trySendMail(info, cfg);	
        tinfo.trxstatus = error ? "E" : "C";
        tinfo.remark = error ? JSON.stringify(error) : JSON.stringify(result);
        trail.updateTracking(context, {keyid: tinfo.keyid, trxstatus: tinfo.trxstatus, remark: tinfo.remark});
    }

	protected async trySendMail(info: MailInfo, cfg: MailConfig) : Promise<[boolean, any, any]> {
        let finished = false;
        let error = null;
        let result = null;
        let loop = this.retry;
        let counter = 0;
        do {
            loop--;
            counter++;
            try {
                result = await MailLibrary.sendMail(info, undefined, cfg);	
                finished = true;
            } catch(ex: any) {
                error = ex;
            }
        } while(!finished && loop>0);
        return [finished, result, error]
	}

}