import { KnModel } from "@willsofts/will-db";
import { KnContextInfo, KnDataTable } from "@willsofts/will-core";
import { TknFactorHandler } from "@willsofts/will-serv";

class FactorImageHandler extends TknFactorHandler {

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.getDataView(context, model);
    }

}

export = new FactorImageHandler();
