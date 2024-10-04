import { KnModel, KnOperation } from "@willsofts/will-db";
import { UserTokenInfo } from "@willsofts/will-lib";
import { KnValidateInfo, KnDataSet } from '../models/KnCoreAlias';
import { KnDataMapEntitySetting } from '../models/KnCoreAlias';
import { TknProcessHandler } from "./TknProcessHandler";
import { TheCategories } from "../utils/TheCategories";
import { KnContextInfo } from '../models/KnCoreAlias';
import { HTTP } from "@willsofts/will-api";
import { Request, Response } from 'express';
import { VALIDATE_PERMISSION } from "../utils/EnvironmentVariable";
import { Utilities } from "@willsofts/will-util";
import { VerifyError } from "../models/VerifyError";

export class TknOperateHandler extends TknProcessHandler {

    public override getDataSetting(name: string) : KnDataMapEntitySetting | undefined {
        return TheCategories.getSetting(name);
    }

    public async report(context: KnContextInfo, req: Request, res: Response) : Promise<void> {
        res.status(HTTP.NOT_IMPLEMENTED).send("Not implementation");
    }

    public override async validatePermission(context: KnContextInfo, model: KnModel, permit?: string, token?: UserTokenInfo) : Promise<KnValidateInfo> {
        if(VALIDATE_PERMISSION && permit && this.progid.trim().length > 0) {
            let userid = token?.userid;
            if(userid && userid.trim().length > 0) {
                let json = await this.call("permit.get",{ progid: this.progid, userid: userid });
                //ex. json = { sfte001: { all: false, insert: false, retrieve: false, update: false, delete: false, import: false, export: false, launch: false, print: false } }
                this.logger.debug(this.constructor.name+".validatePermission: permit response",json);
                if(json && Utilities.hasAttributes(json,[this.progid])) {                    
                    let permits = json[this.progid];
                    if(permits) {
                        return await this.isAllowPermission(permit, permits);
                    }
                }
            }
        }
        return Promise.resolve({valid:true, info: permit});
    }

    public isAllowPermission(permit: string, permits: KnDataSet) : Promise<KnValidateInfo> {
        switch(permit) {
            case KnOperation.ADD:
            case KnOperation.INSERT:
            case KnOperation.CREATE:
            case KnOperation.ENTRY:
                let caninsert = Utilities.parseBoolean(permits["insert"]);
                if(caninsert !== undefined && !caninsert) {
                    return Promise.reject(new VerifyError("Insert permisssion is not allow",HTTP.NOT_ALLOWED,-9001));
                }
                break;
            case KnOperation.UPDATE:
            case KnOperation.EDIT:
                    let canupdate = Utilities.parseBoolean(permits["update"]);
                    if(canupdate !== undefined && !canupdate) {
                        return Promise.reject(new VerifyError("Update permisssion is not allow",HTTP.NOT_ALLOWED,-9002));
                    }
                    break;
            case KnOperation.DELETE:
            case KnOperation.REMOVE:
            case KnOperation.CLEAR:
            case KnOperation.ERASE:
                let canrdelete = Utilities.parseBoolean(permits["delete"]);
                if(canrdelete !== undefined && !canrdelete) {
                    return Promise.reject(new VerifyError("Delete permisssion is not allow",HTTP.NOT_ALLOWED,-9003));
                }
                break;
            case KnOperation.GET:
            case KnOperation.RETRIEVE:
            case KnOperation.RETRIEVAL:
            case KnOperation.COLLECT:
            case KnOperation.FIND:
            case KnOperation.LIST:
            case KnOperation.SEARCH:
            case KnOperation.QUERY:
            case KnOperation.FETCH:
            case KnOperation.INQUIRY:
                let canretrieve = Utilities.parseBoolean(permits["retrieve"]);
                if(canretrieve !== undefined && !canretrieve) {
                    return Promise.reject(new VerifyError("Retrieve permisssion is not allow",HTTP.NOT_ALLOWED,-9004));
                }
                break;
            case KnOperation.IMPORT:
                let canrimport = Utilities.parseBoolean(permits["import"]);
                if(canrimport !== undefined && !canrimport) {
                    return Promise.reject(new VerifyError("Import permisssion is not allow",HTTP.NOT_ALLOWED,-9005));
                }
                break;
            case KnOperation.EXPORT:
                let canrexport = Utilities.parseBoolean(permits["export"]);
                if(canrexport !== undefined && !canrexport) {
                    return Promise.reject(new VerifyError("Export permisssion is not allow",HTTP.NOT_ALLOWED,-9006));
                }
                break;
            case KnOperation.LAUNCH:
                let canlaunch = Utilities.parseBoolean(permits["launch"]);
                if(canlaunch !== undefined && !canlaunch) {
                    return Promise.reject(new VerifyError("Launch permisssion is not allow",HTTP.NOT_ALLOWED,-9007));
                }
                break;            
        }
        return Promise.resolve({valid:true, info: permit});
    }

}
