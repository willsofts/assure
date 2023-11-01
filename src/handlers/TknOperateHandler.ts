import { KnDataMapEntitySetting } from '../models/KnCoreAlias';
import { TknProcessHandler } from "./TknProcessHandler";
import { TheCategories } from "../utils/TheCategories";

export class TknOperateHandler extends TknProcessHandler {

    public override getDataSetting(name: string) : KnDataMapEntitySetting | undefined {
        return TheCategories.getSetting(name);
    }

}
