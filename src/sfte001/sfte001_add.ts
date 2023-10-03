import { KnModel } from "@willsofts/will-db";
import { KnContextInfo, KnDataTable } from "@willsofts/will-core";
import { Sfte001Handler } from "./Sfte001Handler";

/**
 * This for gui launch when add new record
 */
class Sfte001AddHandler extends Sfte001Handler {

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.getDataAdd(context, model);
    }

}

export = new Sfte001AddHandler();
