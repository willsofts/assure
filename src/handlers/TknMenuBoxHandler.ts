import { KnModel } from "@willsofts/will-db";
import { KnDataTable } from "../models/KnCoreAlias";
import { TknMenuHandler } from "./TknMenuHandler";

export class TknMenuBoxHandler extends TknMenuHandler {

    protected override async doExecute(context: any, model: KnModel) : Promise<KnDataTable> {
        return this.doBox(context, model);
    }

    protected override async doHtml(context: any, model: KnModel) : Promise<string> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.getMenuBox(db, context.params.userid, context);
            return await this.buildHtml("/views/menu/box.ejs", { dataset: rs }, context);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

}