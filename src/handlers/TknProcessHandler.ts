import { KnModel, KnSetting, KnTrackingInfo, KnOperationInfo, KnOperation, KnFieldSetting } from "@willsofts/will-db";
import { KnValidateInfo, KnContextInfo, KnDataSet, KnFormatInfo, KnDataTable, KnDataMapEntitySetting, KnDataEntity } from '../models/KnCoreAlias';
import { TknSystemHandler} from './TknSystemHandler';
import { TknDataTableHandler} from './TknDataTableHandler';
import { KnUtility } from '../utils/KnUtility';
import { KnLabelConfig } from '../utils/KnLabelConfig';
import { Utilities } from "@willsofts/will-util";
import { KnDBConnector } from "@willsofts/will-sql";
import { UserTokenInfo } from "@willsofts/will-lib";
import { KnPageRender } from "../utils/KnPageRender";
import { KnCategory } from "../utils/KnCategory";
import { OPERATE_HANDLERS, QUERY_MODES } from "../models/KnServAlias";

export class TknProcessHandler extends TknSystemHandler {

    public settings : KnSetting = { rowsPerPage: 10, maxRowsPerPage: 100, maxLimit: -1, disableColumnSchema: true };
    public userToken?: UserTokenInfo;
    public progid: string = "";
    public handlers = OPERATE_HANDLERS;

    public isCollectMode(action?: string) : boolean {
        if(!action || action.trim().length==0) return false;
        return QUERY_MODES.includes(action);
    }

    public createDataTable(action?: string, dataset: KnDataSet = {}, entities: KnDataEntity | Array<any> = {}, renderer?: string) : KnDataTable {
        return {action: action?action:"", dataset: dataset, entity: entities, renderer: renderer};
    }

    public override createSpan(action:string, context?: any, config?: any) : any {
        try {
            if(context) {
                return (context as any).startSpan(action,{tags: {handler: this.constructor.name, progid: this.progid, ...config}});
            }    
        } catch(ex) { }
        return undefined;
    }

    public async buildHtml(viewfile: string, data: any, context: KnContextInfo, workdir?: string) : Promise<string> {
        let span = this.createSpan("buildHtml", context);
        try {
            let language = KnUtility.getDefaultLanguage(context);
            if(!workdir) workdir = Utilities.getWorkingDir(process.cwd());
            this.logger.debug(this.constructor.name+".buildHtml: viewfile="+viewfile+", workdir="+workdir+", dir="+__dirname); 
            let label = new KnLabelConfig(this.progid, language);
            try { await label.load(workdir); } catch(ex) { this.logger.error("error",ex); }
            let page = new KnPageRender(this.progid, context, label, this, data);
            return page.renderFile(viewfile, {data: data, page: page, label: label, meta: { language: language }}, workdir);
        } finally {
            if(span) span.finish();
        }
    }

    public emptyDataSet(fields?: KnFieldSetting) : KnDataSet {
        let result : KnDataSet = {};
        if(!fields) {
            fields = this.model?.fields;
        }
        if(fields) {
            for(let key in fields) {
                let dbf = fields[key];
                let selected = typeof dbf.selected === "undefined" || dbf.selected;
                if(selected) {
                    result[key] = "";
                }
            }
        }
        return result;
    }
    
    public async getCurrentUserTokenInfo(context: KnContextInfo) : Promise<UserTokenInfo | undefined> {
        this.userToken = await this.getUserTokenInfo(context,true);
        return Promise.resolve(this.userToken);
    }
 
    public transformData(rs: any, fields?: KnFieldSetting) : KnDataSet {
        if(!fields) {
            fields = this.model?.fields;
        }
        return KnUtility.transformData(rs, fields, this.formatData);
    }

    public override trackingInfo(action: string, modelname?: string, tracker?: string) : KnTrackingInfo {
        return super.trackingInfo(action, modelname, tracker?tracker:(this.progid==""?this.constructor.name:this.progid));
    }

    public async get(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: KnOperation.GET, raw: false}, this.doGet);
    }

	public async edit(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: KnOperation.EDIT, raw: false}, this.doEdit);
    }

    public async categories(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: KnOperation.GET, raw: false}, this.doCategories);
    }

    public async html(context: KnContextInfo) : Promise<string> {
        return this.callFunctional(context, {operate: "html", raw: true}, this.doHtml);
    }

    public async search(context: KnContextInfo) : Promise<string> {
        return this.callFunctional(context, {operate: KnOperation.SEARCH, raw: true}, this.doSearch);
    }

    public async add(context: KnContextInfo) : Promise<string> {
        return this.callFunctional(context, {operate: KnOperation.ADD, raw: true}, this.doAdd);
    }

    public async retrieval(context: KnContextInfo) : Promise<string> {
        return this.callFunctional(context, {operate: KnOperation.RETRIEVAL, raw: true}, this.doRetrieval);
    }

    public async query(context: KnContextInfo) : Promise<string> {
        return this.callFunctional(context, {operate: KnOperation.QUERY, raw: true}, this.doQuery);
    }

    public async entry(context: KnContextInfo) : Promise<string> {
        return this.callFunctional(context, {operate: KnOperation.ENTRY, raw: true}, this.doEntry);
    }

    public async view(context: KnContextInfo) : Promise<string> {
        return this.callFunctional(context, {operate: KnOperation.VIEW, raw: true}, this.doView);
    }

	protected async doEdit(context: KnContextInfo, model: KnModel) : Promise<any> {
        return this.doUpdate(context,model);
    }

    protected async doGet(context: KnContextInfo, model: KnModel) : Promise<any> {
        return this.doRetrieve(context, model);
    }

    protected async doCategories(context: KnContextInfo, model: KnModel) : Promise<any> {
        return this.notImplementation();
    }

    protected async doHtml(context: KnContextInfo, model: KnModel) : Promise<string> {
        let ds = await this.doExecute(context, model);
        return this.buildHtml("/views/"+(ds.renderer?ds.renderer:"pages/none"), ds, context);
    }

    protected override async doClear(context: KnContextInfo, model: KnModel) : Promise<any> {
        return this.doRemove(context, model);
    }

    protected override async doCreate(context: KnContextInfo, model: KnModel) : Promise<any> {
        return this.doInsert(context, model);
    }

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<any> {
        return Promise.resolve(this.createRecordSet());
    }

    protected override async doList(context: KnContextInfo, model: KnModel) : Promise<any> {
        return this.doFind(context, model);
    }

    protected override async doFind(context: KnContextInfo, model: KnModel) : Promise<any> {
        return this.doCollect(context, model);
    }

    protected async doCollecting(context: KnContextInfo, model: KnModel, action: string = KnOperation.COLLECT): Promise<any> {
        return this.doFinding(context, model, action);
    }

    protected async doRetrieving(context: KnContextInfo, model: KnModel, action: string = KnOperation.RETRIEVE): Promise<any> {
        return this.doFinding(context, model, action);
    }

    protected async doRemoving(context: KnContextInfo, model: KnModel): Promise<any> {
        return this.doClearing(context, model);
    }

    protected async doInserting(context: KnContextInfo, model: KnModel): Promise<any> {
        return this.doCreating(context, model);
    }

    protected async doEditing(context: KnContextInfo, model: KnModel): Promise<any> {
        return this.doUpdating(context, model);
    }

    protected async doSearching(context: KnContextInfo, model: KnModel, action: string = KnOperation.COLLECT): Promise<any> {
        let ds = await this.getDataSearch(context, model);
        return this.buildHtml("/views/"+ds.renderer, ds, context);
    }   

    protected async doAdding(context: KnContextInfo, model: KnModel, action: string = KnOperation.ADD): Promise<any> {
        let ds = await this.getDataAdd(context, model);
        return this.buildHtml("/views/"+ds.renderer, ds, context);
    }   

    protected async doRetrievaling(context: KnContextInfo, model: KnModel, action: string = KnOperation.RETRIEVAL): Promise<any> {
        let ds = await this.getDataRetrieval(context, model);
        return this.buildHtml("/views/"+ds.renderer, ds, context);
    }   

    protected async doQuerying(context: KnContextInfo, model: KnModel, action: string = KnOperation.COLLECT): Promise<any> {
        let ds = await this.getDataQuery(context, model);
        return this.buildHtml("/views/"+ds.renderer, ds, context);
    }   

    protected async doEntrying(context: KnContextInfo, model: KnModel, action: string = KnOperation.ADD): Promise<any> {
        let ds = await this.getDataEntry(context, model);
        return this.buildHtml("/views/"+ds.renderer, ds, context);
    }   

    protected async doViewing(context: KnContextInfo, model: KnModel, action: string = KnOperation.RETRIEVAL): Promise<any> {
        let ds = await this.getDataView(context, model);
        return this.buildHtml("/views/"+ds.renderer, ds, context);
    }   

    protected validateRequireFields(context: KnContextInfo, model: KnModel, action?: string) : Promise<KnValidateInfo> {
        return Promise.resolve({valid:true});
    }

    public validatePermission(context: KnContextInfo, model: KnModel, permit?: string, token?: UserTokenInfo) : Promise<KnValidateInfo> {
        return Promise.resolve({valid:true, info: permit});
    }

    protected override async exposeOperation(context: KnContextInfo, model: KnModel, KnOperation: KnOperationInfo) : Promise<void> {
		await this.exposeContext(context);
        let token = await this.getCurrentUserTokenInfo(context);
        await this.validatePermission(context, model, KnOperation.operate, token);        
    }

    protected override async doInsert(context: KnContextInfo, model: KnModel) : Promise<any> {
        await this.validateRequireFields(context, model, KnOperation.INSERT);
        let rs = await this.doInserting(context, model);
        return await this.createCipherData(context, KnOperation.INSERT, rs);
    }

    protected override async doRetrieve(context: KnContextInfo, model: KnModel) : Promise<any> {
        await this.validateRequireFields(context, model, KnOperation.RETRIEVE);
        let rs = await this.doRetrieving(context, model, KnOperation.RETRIEVE);
        return await this.createCipherData(context, KnOperation.RETRIEVE, rs);
    }

    protected override async doUpdate(context: KnContextInfo, model: KnModel) : Promise<any> {
        await this.validateRequireFields(context, model, KnOperation.UPDATE);
        let rs = await this.doEditing(context, model);
        return await this.createCipherData(context, KnOperation.UPDATE, rs);
    }

    protected override async doRemove(context: KnContextInfo, model: KnModel) : Promise<any> {
        await this.validateRequireFields(context, model, KnOperation.DELETE);
        let rs = await this.doRemoving(context, model);
        return await this.createCipherData(context, KnOperation.DELETE, rs);
    }

    protected override async doCollect(context: KnContextInfo, model: KnModel) : Promise<any> {
        let rs = await this.doCollecting(context, model, KnOperation.COLLECT);
        return await this.createCipherData(context, KnOperation.COLLECT, rs);
    }

    protected async doSearch(context: KnContextInfo, model: KnModel) : Promise<any> {
        let rs = await this.doSearching(context, model, KnOperation.SEARCH);
        return await this.createCipherData(context, KnOperation.SEARCH, rs);
    }

    protected async doAdd(context: KnContextInfo, model: KnModel) : Promise<any> {
        let rs = await this.doAdding(context, model, KnOperation.ADD);
        return await this.createCipherData(context, KnOperation.ADD, rs);
    }

    protected async doRetrieval(context: KnContextInfo, model: KnModel) : Promise<any> {
        await this.validateRequireFields(context, model, KnOperation.RETRIEVAL);
        let rs = await this.doRetrievaling(context, model, KnOperation.RETRIEVAL);
        return await this.createCipherData(context, KnOperation.RETRIEVAL, rs);
    }

    protected async doQuery(context: KnContextInfo, model: KnModel) : Promise<any> {
        let rs = await this.doQuerying(context, model, KnOperation.QUERY);
        return await this.createCipherData(context, KnOperation.QUERY, rs);
    }

    protected async doEntry(context: KnContextInfo, model: KnModel) : Promise<any> {
        let rs = await this.doEntrying(context, model, KnOperation.ENTRY);
        return await this.createCipherData(context, KnOperation.ENTRY, rs);
    }

    protected async doView(context: KnContextInfo, model: KnModel) : Promise<any> {
        await this.validateRequireFields(context, model, KnOperation.VIEW);
        let rs = await this.doViewing(context, model, KnOperation.VIEW);
        return await this.createCipherData(context, KnOperation.VIEW, rs);
    }

    protected formatData(info: KnFormatInfo) : any {
        return KnUtility.formatData(info);
    }

    public async getDataSearch(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.notImplementation();
    }    

    public async getDataAdd(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.notImplementation();
    }

    public async getDataRetrieval(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.notImplementation();
    }

    public async getDataQuery(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.notImplementation();
    }    

    public async getDataEntry(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.notImplementation();
    }    
    
    public async getDataView(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.notImplementation();
    }    

    public async getDataCategories(context: KnContextInfo, db: KnDBConnector, settings : KnDataMapEntitySetting[]) : Promise<KnDataTable> {
        let handler = new TknDataTableHandler();
        let dt = await handler.getDataCategory(db, settings, true, context); //map
        return this.createDataTable("categories", {}, dt);
    }

    public async getDataLists(context: KnContextInfo, db: KnDBConnector, settings : KnDataMapEntitySetting[]) : Promise<KnDataTable> {
        let handler = new TknDataTableHandler();
        let dt = await handler.getDataTable(db, settings, true, context); //list
        return this.createDataTable("categories", {}, dt);
    }

    public getDataSetting(name: string) : KnDataMapEntitySetting | undefined {
        return undefined;
    }

    public getCategorySetting(context: KnContextInfo, ...names: string[]) : KnDataMapEntitySetting[] {
        return KnCategory.getSetting(context, this.getDataSetting, this.userToken, ...names);
    }

}
