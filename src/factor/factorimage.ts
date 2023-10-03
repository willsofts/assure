import { KnModel } from "@willsofts/will-db";
import { KnContextInfo, KnDataTable } from "@willsofts/will-core";
import { FactorHandler } from "./FactorHandler";

class FactorImageHandler extends FactorHandler {

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.getDataView(context, model);
    }

}

export = new FactorImageHandler();
