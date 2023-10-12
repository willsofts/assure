import { KnDataMapEntitySetting } from '../models/KnCoreAlias';
import { TheCategories } from "../utils/TheCategories";
import { TknProcessHandler } from "./TknProcessHandler";

export class TknOperateHandler extends TknProcessHandler {

    public getDataSetting(name: string) : KnDataMapEntitySetting | undefined {
        return TheCategories.getSetting(name);
    }

}
