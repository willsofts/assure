import { KnModel } from "@willsofts/will-db";
import { KnDataTable } from "../models/KnCoreAlias";
import { TknMenuHandler } from "./TknMenuHandler";

export class TknMenuSideBarHandler extends TknMenuHandler {

    protected override async doExecute(context: any, model: KnModel) : Promise<KnDataTable> {
        return this.doSide(context, model);
    }

    protected override async doHtml(context: any, model: KnModel) : Promise<string> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.getSideBarMenu(db, context.params.userid, context);
            rs = this.createRecordSet(rs);
            let ds = this.createSideBarMenu(rs);
            return await this.buildHtml("/views/menu/side.ejs", { dataset: ds }, context);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

}
