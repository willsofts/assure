import { KnModel } from "@willsofts/will-db";
import { KnContextInfo, KnDataTable } from "@willsofts/will-core";
import { Sfte001Handler } from "./Sfte001Handler";

/**
 * This for gui launch when search records
 */
class Sfte001SearchHandler extends Sfte001Handler {

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.getDataSearch(context, model);
    }

}

export = new Sfte001SearchHandler();
