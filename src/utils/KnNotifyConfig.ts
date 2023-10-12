import { KnDBConnector, KnSQL } from "@willsofts/will-sql";
import { KnTemplateInfo, KnDataSet } from "../models/KnCoreAlias";

export class KnNotifyConfig {

    public async getConfigValue(db: KnDBConnector, category: string, colname: string, context?: any) : Promise<string> {
        let result = "";
        let knsql = new KnSQL();
        knsql.append("select colvalue from tconfig where category='").append(category).append("' and colname='").append(colname).append("' ");
        let rs = await knsql.executeQuery(db,context);
        if(rs && rs.rows.length>0) {
            result = rs.rows[0].colvalue;
        }
        return result;
    }

    public async getConfigCategory(db: KnDBConnector, category: string, context?: any) : Promise<KnDataSet> {
        let result : KnDataSet = {};
        let knsql = new KnSQL();
        knsql.append("select colname,colvalue from tconfig where category='").append(category).append("' ");
        let rs = await knsql.executeQuery(db,context);
        if(rs && rs.rows.length>0) {
            for(let row of rs.rows) {
                result[row.colname] = row.colvalue;
            }
        }
        return result;
    }

    public async getApproveURL(db: KnDBConnector, context?: any) : Promise<string> {
        return await this.getConfigValue(db, "CONFIGURATION", "APPROVE_URL", context);
    }

    public async getActivateURL(db: KnDBConnector, context?: any) : Promise<string> {
        return await this.getConfigValue(db, "CONFIGURATION", "ACTIVATE_URL", context);
    }
    
    public async getConfigTemplate(db: KnDBConnector, template: string, templatetype: string, context?: any) : Promise<KnTemplateInfo | undefined> {
        let result = undefined;
        let knsql = new KnSQL();
		knsql.append("select subjecttitle,contents,contexts from ttemplate ");
		knsql.append("where template='").append(template).append("' and templatetype='").append(templatetype).append("' ");
        let rs = await knsql.executeQuery(db,context);
        if(rs && rs.rows.length>0) {
            let row = rs.rows[0];
            result = {
                subjecttitle: row.subjecttitle,
                contents: row.contents,
                contexts: row.contexts
            };
        }
        return result;
    }

    public async isVerifyConfig(db: KnDBConnector, category: string, colname: string, context?: any) : Promise<boolean> {
        let result = false;
        let colvalue = await this.getConfigValue(db, category, colname, context);
        if(colvalue && colvalue.trim().toLowerCase() == "true") {
            result = true;
        }
        return result;
    }

}
