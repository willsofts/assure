import { KnModel } from "@willsofts/will-db";
import { KnContextInfo, KnDataTable } from "../models/KnCoreAlias";
import { Sfte001Handler } from "./Sfte001Handler";

/**
 * This for gui launch when retrieve record
 */
class Sfte001RetrievalHandler extends Sfte001Handler {

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.getDataRetrieval(context, model);
    }

}

export = new Sfte001RetrievalHandler();
