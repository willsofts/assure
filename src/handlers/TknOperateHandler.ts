import { KnDataMapEntitySetting } from '@willsofts/will-core';
import { TheCategories } from "../utils/TheCategories";
import { TknProcessHandler } from "@willsofts/will-serv";

export class TknOperateHandler extends TknProcessHandler {

    public getDataSetting(name: string) : KnDataMapEntitySetting | undefined {
        return TheCategories.getSetting(name);
    }

}
