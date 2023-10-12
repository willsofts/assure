import { KnModel, KnOperation } from "@willsofts/will-db";
import { KnDBConnector, KnRecordSet, KnSQL } from "@willsofts/will-sql";
import { KnContextInfo, KnDataTable, KnDataSet } from '../models/KnCoreAlias';
import { Utilities } from "@willsofts/will-util";
import { TknOperateHandler } from '../handlers/TknOperateHandler';
import { KnConfigMapperSetting } from '../models/KnServAlias';

export class Sfte012Handler extends TknOperateHandler {

    public progid = "sfte012";
    public model : KnModel = { 
        name: "tconfig", 
        alias: { privateAlias: this.section }, 
        fields: {
            mailserver: { type: "STRING", calculated: true },
            mailport: { type: "STRING", calculated: true },
            mailuser: { type: "STRING", calculated: true },
            mailpassword: { type: "STRING", calculated: true },
            mailfrom: { type: "STRING", calculated: true },
            mailto: { type: "STRING", calculated: true },
            mailtitle: { type: "STRING", calculated: true },
            factorverify: { type: "STRING", calculated: true },
            factorissuer: { type: "STRING", calculated: true },
            approveurl: { type: "STRING", calculated: true },
            activateurl: { type: "STRING", calculated: true }
        },
    };

    public configMappers: KnConfigMapperSetting[] = [
        {category: "CONFIGMAIL", colname: "MAIL_SERVER", fieldname: "mailserver", columnOnly: true, altercolnames: ["mail.smtps.host"]},
        {category: "CONFIGMAIL", colname: "MAIL_PORT", fieldname: "mailport", columnOnly: true},
        {category: "CONFIGMAIL", colname: "MAIL_USER", fieldname: "mailuser", columnOnly: true},
        {category: "CONFIGMAIL", colname: "MAIL_PASSWORD", fieldname: "mailpassword", columnOnly: true},
        {category: "CONFIGMAIL", colname: "MAIL_FROM", fieldname: "mailfrom", columnOnly: true},
        {category: "CONFIGMAIL", colname: "MAIL_TO", fieldname: "mailto", columnOnly: false},
        {category: "CONFIGMAIL", colname: "MAIL_TITLE", fieldname: "mailtitle", columnOnly: true},
        {category: "CONFIGURATION", colname: "APPROVE_URL", fieldname: "approveurl", columnOnly: false},
        {category: "CONFIGURATION", colname: "ACTIVATE_URL", fieldname: "activateurl", columnOnly: false},
        {category: "2FA", colname: "FACTORVERIFY", fieldname: "factorverify", columnOnly: false, boolflag: true},
        {category: "2FA", colname: "FACTORISSUER", fieldname: "factorissuer", columnOnly: false},
    ];

    /* override to handle launch router when invoked from menu */
    protected override async doRetrieving(context: KnContextInfo, model: KnModel, action: string = KnOperation.RETRIEVE): Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let rs = await this.performRetrieving(context, model, db);
            if(rs.rows.length>0) {
                let row = this.transformData(rs.rows[0]);
                return this.createDataTable(KnOperation.RETRIEVE, row);
            }
            return this.recordNotFound();
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    protected async performRetrieving(context: KnContextInfo, model: KnModel, db: KnDBConnector): Promise<KnRecordSet> {
        let record : KnDataSet = {};
        let knsql = new KnSQL();
        knsql.append("select * from tconfig ");
        knsql.append("where category in ('CONFIGMAIL','CONFIGURATION','notification','2FA') ");
        let rs = await knsql.executeQuery(db,context);
        if(rs && rs.rows.length>0) {
            for(let row of rs.rows) {
                let category = row.category;
                let colname = row.colname;
                let colvalue = row.colvalue;
                for(let cfg of this.configMappers) {
                    if(Utilities.equalsIgnoreCase(category,cfg.category) && Utilities.equalsIgnoreCase(colname,cfg.colname)) {
                        record[cfg.fieldname] = colvalue;
                    }
                }
            }
        }
        return {records: Object.keys(record).length>0?1:0, rows: [record], columns: null};
    }
    
    /**
     * Override for retrieval action (return record not found error if not found any record)
     * @param context 
     * @param model 
     * @returns KnDataTable
     */
    public override async getDataRetrieval(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        let db = this.getPrivateConnector(model);
        try {
            let row = this.transformData({});
            let rs =  await this.performRetrieving(context, model, db);
            if(rs.rows.length>0) {
                row = this.transformData(rs.rows[0]);
            }
            return this.createDataTable(KnOperation.RETRIEVAL, row, {}, "sfte012/sfte012");
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
        }
    }

    protected override async doExecute(context: KnContextInfo, model: KnModel) : Promise<KnDataTable> {
        return this.getDataRetrieval(context, model);
    }

    /**
     * Override in order to update records
     */
    protected override async doUpdating(context: any, model: KnModel): Promise<KnRecordSet> {
        let result = this.createRecordSet();
		let db = this.getPrivateConnector(model);
		try {
            result = await this.updateConfigTable(context, db);
		} catch(ex: any) {
			this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
		} finally {
			if(db) db.close();
		}
        return result;
    }

    public async updateConfigTable(context: KnContextInfo, db: KnDBConnector) : Promise<KnRecordSet> {  
        let result = this.createRecordSet();
        await db.beginWork();
        try {
            let catsql = new KnSQL();
            catsql.append("update tconfig set colvalue = ?colvalue ");
            catsql.append("where category = ?category and colname = ?colname ");
            let colsql = new KnSQL();
            colsql.append("update tconfig set colvalue = ?colvalue ");
            colsql.append("where colname = ?colname ");
            let insql = new KnSQL();
            insql.append("insert into tconfig (category,colname,colvalue) ");
            insql.append("values(?category,?colname,?colvalue) ");
            for(let cfg of this.configMappers) {
                let colvalue = context.params[cfg.fieldname];
                if(cfg.boolflag && (!colvalue || colvalue.trim()=="")) {
                    colvalue = "false";
                }
                if(cfg.columnOnly) {
                    colsql.clearParameter();
                    colsql.set("colvalue",colvalue);
                    colsql.set("colname",cfg.colname);
                    let rs = await colsql.executeUpdate(db,context);
                    let rc = this.createRecordSet(rs);
                    result.records += rc.records;
                    if(cfg.altercolnames && cfg.altercolnames.length>0) {
                        for(let acolname of cfg.altercolnames) {
                            colsql.clearParameter();
                            colsql.set("colvalue",colvalue);
                            colsql.set("colname",acolname);
                            rs = await colsql.executeUpdate(db,context);
                            let rc = this.createRecordSet(rs);
                            result.records += rc.records;
                        }
                    }
                } else {
                    catsql.clearParameter();
                    catsql.set("colvalue",colvalue);
                    catsql.set("category",cfg.category);
                    catsql.set("colname",cfg.colname);
                    let rs = await catsql.executeUpdate(db,context);
                    let rc = this.createRecordSet(rs);
                    if(rc.records<1) {
                        insql.clearParameter();
                        insql.set("colvalue",colvalue);
                        insql.set("category",cfg.category);
                        insql.set("colname",cfg.colname);
                        rs = await insql.executeUpdate(db,context);
                        rc = this.createRecordSet(rs);
                    }
                    result.records += rc.records;
                    if(cfg.altercolnames && cfg.altercolnames.length>0) {
                        for(let acolname of cfg.altercolnames) {
                            catsql.clearParameter();
                            catsql.set("colvalue",colvalue);
                            catsql.set("category",cfg.category);
                            catsql.set("colname",acolname);
                            rs = await catsql.executeUpdate(db,context);					
                            rc = this.createRecordSet(rs);
                            if(rc.records<1) {
                                insql.clearParameter();
                                insql.set("colvalue",colvalue);
                                insql.set("category",cfg.category);
                                insql.set("colname",acolname);
                                rs = await insql.executeUpdate(db,context);
                                rc = this.createRecordSet(rs);
                            }
                            result.records += rc.records;
                        }
                    }
                }
            }        
            await db.commitWork(); 
            return result;                   
        } catch(ex: any) {
            await db.rollbackWork();
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(ex);
        }
    }

}
