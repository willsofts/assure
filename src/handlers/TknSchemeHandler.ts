import { KnModel } from "@willsofts/will-db";
import { HTTP } from "@willsofts/will-api";
import { KnContextInfo } from '../models/KnCoreAlias';
import { VerifyError } from "../models/VerifyError";
import { TknSystemHandler } from "./TknSystemHandler";

export class TknSchemeHandler extends TknSystemHandler {

    public async get(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: "get", raw: false}, this.doGet);
    }

	public async edit(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: "edit", raw: false}, this.doEdit);
    }

    public async html(context: KnContextInfo) : Promise<string> {
        return this.callFunctional(context, {operate: "html", raw: true}, this.doHtml);
    }

	protected async doEdit(context: KnContextInfo, model: KnModel) : Promise<any> {
        return this.notImplementation();
    }

    protected async doGet(context: KnContextInfo, model: KnModel) : Promise<any> {
        return this.notImplementation();
    }

    protected async doHtml(context: KnContextInfo, model: KnModel) : Promise<string> {
        return Promise.reject(new VerifyError("Not implemented",HTTP.NOT_IMPLEMENTED,-16005));
    }

    protected override async doClear(context: KnContextInfo, model: KnModel) : Promise<any> {
        return this.notImplementation();
    }

    protected override async doCreate(context: KnContextInfo, model: KnModel) : Promise<any> {
        return this.notImplementation();
    }

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<any> {
        return this.notImplementation();
    }

    protected override async doList(context: KnContextInfo, model: KnModel) : Promise<any> {
        return this.notImplementation();
    }

    protected override async doFind(context: KnContextInfo, model: KnModel) : Promise<any> {
        return this.notImplementation();
    }

    protected override async doInsert(context: KnContextInfo, model: KnModel) : Promise<any> {
        return this.notImplementation();
    }

    protected override async doRetrieve(context: KnContextInfo, model: KnModel) : Promise<any> {
        return this.notImplementation();
    }

    protected override async doUpdate(context: KnContextInfo, model: KnModel) : Promise<any> {
        return this.notImplementation();
    }

    protected override async doRemove(context: KnContextInfo, model: KnModel) : Promise<any> {
        return this.notImplementation();
    }

    protected override async doCollect(context: KnContextInfo, model: KnModel) : Promise<any> {
        return this.notImplementation();
    }

}
