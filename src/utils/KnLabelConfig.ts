import { KnLabelUtility } from "./KnLabelUtility";
import { KnDataEntity } from "../models/KnCoreAlias";

const datalabel : KnDataEntity = {};

export class KnLabelConfig {
    public label: KnDataEntity = {};

    constructor(public configname: string, public language: string = "EN") {
    }

    public async load(workdir?: string, labelpath: string = "label") {
        let util = new KnLabelUtility(this.configname);
        this.label = await util.loadAndBuild(workdir, labelpath);
        if(!datalabel.default_label) {
            let defutil = new KnLabelUtility("default_label");
            datalabel["default_label"] = await defutil.loadAndBuild(workdir, labelpath);
        }
    }

    public get(key: string, defaultLabel?: string, language?: string) {
        if(!language) language = this.language;
        let result = undefined;
        if(this.label.hasOwnProperty(language)) {
            let langmap = this.label[language];
            if(langmap.hasOwnProperty(key)) {
                result = langmap[key];
            }
        }
        if(!result) {
            if(datalabel.hasOwnProperty("default_label")) {
                let deflabel = datalabel["default_label"];
                if(deflabel) {
                    if(deflabel.hasOwnProperty(language)) {
                        let deflabellang = deflabel[language];
                        if(deflabellang) {
                            if(deflabellang.hasOwnProperty(key)) {
                                result = deflabellang[key];
                            }
                        }
                    }
                }
            }
        }
        return result?result:defaultLabel;
    }

}