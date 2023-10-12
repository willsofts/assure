import { Utilities } from "@willsofts/will-util";
import { KnLabelData, KnDataEntity, KnDataSet } from "../models/KnCoreAlias";
import path from 'path';
import fs from 'fs';

export class KnLabelUtility {
    public labelname : string;

    constructor(labelname: string) {
        this.labelname = labelname;
    }

    public async load(workdir?: string, labelpath: string = "label") : Promise<KnLabelData[]> {
        let filename = this.labelname;
        if(filename.lastIndexOf(".json")<0) filename += ".json";
        if(!workdir) workdir = Utilities.getWorkingDir(path.dirname(__dirname)); 
        let fullfilename = path.join(workdir,labelpath,filename);
        let existing = fs.existsSync(fullfilename);
        if(existing) {
            try {
                let data = fs.readFileSync(fullfilename,"utf-8");
                return JSON.parse(data);
            } catch(ex) {
                console.error(ex);
            }
        }
        return [];
    }

    public build(ary: KnLabelData[]) : KnDataEntity {
        let result : KnDataEntity = {};
        if(ary) {
            for(let data of ary) {
                let ds : KnDataSet = {};
                for(let item of data.label) {
                    ds[item.name] = item.value;
                }
                result[data.language] = ds;
            }
        }
        return result;        
    }

    public async loadAndBuild(workdir?: string, labelpath: string = "label") : Promise<KnDataEntity> {
        let ary = await this.load(workdir, labelpath);
        return this.build(ary);
    }

}