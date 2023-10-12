import { KnModel } from "@willsofts/will-db";
import { KnContextInfo, KnDataTable } from "../models/KnCoreAlias";
import { TknFactorHandler } from "../handlers/TknFactorHandler";

class FactorImageHandler extends TknFactorHandler {

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.getDataView(context, model);
    }

}

export = new FactorImageHandler();
