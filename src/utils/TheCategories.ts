import { KnDataMapEntitySetting } from "../models/KnCoreAlias";
import { Setting } from "@willsofts/will-util";

export class TheCategories {

    public static getSetting(name: string) : KnDataMapEntitySetting | undefined {
        return Setting.getSetting("categories")[name];
    }
    
}