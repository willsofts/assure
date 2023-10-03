import { KnModel } from "@willsofts/will-db";
import { KnContextInfo, KnDataTable } from "@willsofts/will-core";
import { Sftq001Handler } from "./Sftq001Handler";

class Sftq001SearchHandler extends Sftq001Handler {

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.getDataSearch(context, model);
    }

}

export = new Sftq001SearchHandler();
