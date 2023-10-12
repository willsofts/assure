import { KnModel } from "@willsofts/will-db";
import { KnResultSet } from '@willsofts/will-sql';
import { KnDataTable } from "../models/KnCoreAlias";
import { TknMenuHandler } from "./TknMenuHandler";

export class TknMenuFavorHandler extends TknMenuHandler {

    protected override async doExecute(context: any, model: KnModel) : Promise<KnDataTable> {
        return this.doFavor(context, model);
    }
    
    protected override async doHtml(context: any, model: KnModel) : Promise<string> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.getFavorMenu(db, context.params.userid, context);
            //return this.createHtml(rs);
            return await this.buildHtml("/views/menu/favor.ejs", { dataset: rs }, context);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    public createHtml(rs: KnResultSet, max: number = 9) : string {
        let html = "";
        let len = rs.rows.length;
        for(let idx=0; idx < max; idx++) {
            if(idx < len) {
                let r = rs.rows[idx];
                html += "<a href=\"javascript:void(0)\" class=\"tile fa-box-title fav-app\" ";
                html += "seqno=\""+(idx+1)+"\" pid=\""+r['programid']+"\" ";
                html += "url=\""+r['url']+"\">";
                html += "<div class=\"icon\">";
                html += "<img class=\"fa fa-app-image\" src=\"/img/apps/"+r['iconfile']+"\" alt=\"\"/>";
                html += "</div><span class=\"title\">"+r['progname']+"</span></a>";
            } else {
                html += "<a href=\"javascript:void(0)\" class=\"tile fa-box-title fav-blank\" title=\"New Favorite\" ";
                html += "seqno=\""+(idx+1)+"\"><div class=\"icon\">";
                html += "<img class=\"fa fa-app-image\" src=\"/img/apps/fs_icon.png\" alt=\"\"/></div><span class=\"title\">Add New</span></a>";
            }
        }
        return html;
    }

}