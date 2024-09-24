import { KnDataMapEntitySetting } from '../models/KnCoreAlias';
import { TknProcessHandler } from "./TknProcessHandler";
import { TheCategories } from "../utils/TheCategories";
import { KnContextInfo } from '../models/KnCoreAlias';
import { HTTP } from "@willsofts/will-api";
import { Request, Response } from 'express';

export class TknOperateHandler extends TknProcessHandler {

    public override getDataSetting(name: string) : KnDataMapEntitySetting | undefined {
        return TheCategories.getSetting(name);
    }

    public async report(context: KnContextInfo, req: Request, res: Response) : Promise<void> {
        res.status(HTTP.NOT_IMPLEMENTED).send("Not implementation");
    }

}
