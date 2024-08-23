import { KnModel } from "@willsofts/will-db";
import { KnContextInfo } from '../models/KnCoreAlias';
import { TknSystemHandler } from "./TknSystemHandler";

export class TknExposeHandler extends TknSystemHandler {
    public model : KnModel = { name: "tusertoken", alias: { privateAlias: this.section } };

    public handlers = [ {name: "cipher"} ];

    public async cipher(context: KnContextInfo) : Promise<any> {
        return this.callFunctional(context, {operate: "cipher", raw: false}, this.doCipher);
    }

    public async doCipher(context: KnContextInfo, model: KnModel = this.model) : Promise<any> {
        return this.exposeCipher(context);
    }

    public async exposeCipher(context: KnContextInfo, includeChiperData: boolean = true) : Promise<any> {
        let results = context.params;
        let ciphertext = context.params.ciphertext;
        this.logger.debug(this.constructor.name+".exposeCipher: ciphertext",ciphertext);
        let dh = await this.getUserDH(context);
        this.logger.debug(this.constructor.name+".exposeCipher: dh",dh);
        if(dh) {
            if(ciphertext && ciphertext!="") {
                let jsonstr = dh.decrypt(ciphertext);
                this.logger.debug(this.constructor.name+".exposeCipher",jsonstr);
                if(jsonstr && jsonstr!="") {
                    let json = JSON.parse(jsonstr);
                    if(!includeChiperData) {
                        delete context.params.ciphertext;
                    }
                    results = { ...context.params, ...json };
                }
            }
        }        
        return Promise.resolve(results);
    }

}
