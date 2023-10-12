import path from 'path';
import fs from 'fs';
import { Utilities } from "@willsofts/will-util";
import { HTTP } from "@willsofts/will-api";
import { VerifyError } from "../models/VerifyError";
import { KnUtility } from "../utils/KnUtility";
import { KnPageFacility } from './KnPageFacility';

const ejs = require('ejs');

export class KnPageRender extends KnPageFacility {

    public async renderHtml(viewfile: string, data: any, workdir?: string) : Promise<string> {
        return this.renderFile(viewfile, {data: data, page: this, meta: { language: KnUtility.getDefaultLanguage(this.context)}}, workdir);
    }

    public async renderFile(filename: string, data?: any, workdir?: string, options?: any) : Promise<string> {
        if(filename.lastIndexOf(".ejs")<0) filename += ".ejs";
        if(!workdir) workdir = Utilities.getWorkingDir(path.dirname(__dirname)); 
        let fullfilename = workdir+filename;
        let existing = fs.existsSync(fullfilename);
        if(!existing) return Promise.reject(new VerifyError("File not found ("+filename+")",HTTP.NOT_IMPLEMENTED,-17001));
        return ejs.renderFile(fullfilename, data, options);
    }

    public html(tag: string, options?: any) : string {
        if("select"==tag) {
            return this.createTagSelect(options);
        } else if("date"==tag) {
            return this.createTagDate(options);
        } else if("int"==tag) {
            return this.createTagInt(options);
        } else if("money"==tag) {
            return this.createTagMoney(options);
        }
        return "";
    }

    public createTagSelect(options?: any) : string {
        let html = "";
        let map = options?.map;
        if(map) {
            let value = options?.value;
            let name = options?.name;
            let id = options?.id;
            if(!id) id = name;
            let multiple = options?.multiple;
            let clazz = options?.class;
            let style = options?.style;
            let disabled = options?.disabled;
            let readonly = options?.readonly;
            let onchange = options?.onchange;
            let onclick = options?.onclick;
            let showing = options?.showing;
            let delimiter = options?.delimiter || " - ";
            html = "<select";
            html += (name?" name=\""+name+"\"":"");
            html += (id?" id=\""+id+"\"":"");
            html += (multiple?" multiple=\""+multiple+"\"":"");
            html += (clazz?" class=\""+clazz+"\"":"");
            html += (style?" style=\""+style+"\"":"");
            html += (onchange?" onchange=\""+onchange+"\"":"");
            html += (onclick?" onclick=\""+onclick+"\"":"");
            if(readonly) html += " readonly ";
            if(disabled) {
                if("true"==disabled) html += " disabled ";
                else if("false"!=disabled) html += " disabled=\""+disabled+"\" ";
            } 
            html += ">\n";
            if(options.empty) {
                html += "<option value=\""+(options.emptyValue?options.emptyValue:"")+"\">"+(options.emptyCaption?options.emptyCaption:"")+"</option>\n";
            }
            for(let key in map) {
                let selected = value == key ? " selected" : "";
                if(showing=="both") {
                    html += "<option value=\""+key+"\""+selected+">"+key+delimiter+map[key]+"</option>\n";
                } else {
                    html += "<option value=\""+key+"\""+selected+">"+map[key]+"</option>\n";
                }
            }
            html += "</select>"            
        }
        return html;
    }

    public createTagDate(options?: any) : string {
        let value = options?.value;
        let name = options?.name;
        let id = options?.id;
        if(!id) id = name;
        let clazz = options?.class;
        let style = options?.style;
        let disabled = options?.disabled;
        let readonly = options?.readonly || true;
        if(!clazz) clazz = "";
        if(clazz.indexOf("idate")<0) clazz += " idate";
        let html = "<div class=\"input-group-container\">";
        html += "<div class=\"input-group input-group-calendar\">";
        html += "<input";
        html += (name?" name=\""+name+"\"":"");
        html += (id?" id=\""+id+"\"":"");
        html += (clazz?" class=\""+clazz+"\"":"");
        html += (style?" style=\""+style+"\"":"");
        html += " picture='99/99/9999'";
        html += " maxlength='10' editable='true' ";
        if(readonly) html += " readonly ";
        if(disabled) {
            if("true"==disabled) html += " disabled ";
            else if("false"!=disabled) html += " disabled=\""+disabled+"\" ";
        } 
        if(value) { 
            html += " value=\""+value+"\"";
        } else {
            if(options?.current) {
                value = this.format({value: Utilities.now(), field: {type: "DATE"}});
                html += " value=\""+value+"\"";
            }
        }
        html += " />";
        html += "<A href=\"javascript:void(0);\"  NAME=\"LK"+id+"\" ID=\"LK"+id+"\" tabIndex=\"-1\" class=\"input-group-addon input-group-append input-group-text input-group-lookup\"";
        html += " onclick='fs_opencalendar(\"/js/calendar/\",document.getElementById(\""+id+"\"))'>";
        html += "<i class=\"fa fa-calendar\" aria-hidden=\"true\"></i></A>";
        html += "<A href=\"javascript:void(0);\"  NAME=\"CLR"+id+"\" ID=\"CLR"+id+"\" tabIndex=\"-1\" class=\"input-group-addon input-group-append input-group-text input-group-clear\"";  
        html += " onclick='fs_clearcalendar(document.getElementById(\""+id+"\"))'><i class=\"fa fa-times\" aria-hidden=\"true\"></i></A>";
        html += "</div></div>";
        return html;
    }

    public createTagInt(options?: any) : string {
        let value = options?.value;
        let name = options?.name;
        let id = options?.id;
        if(!id) id = name;
        let clazz = options?.class;
        let style = options?.style;
        let disabled = options?.disabled;
        let readonly = options?.readonly;
        let size = options?.size || 10;
        let max = options?.max;
        if(!clazz) clazz = "";
        if(clazz.indexOf("iint")<0) clazz += " iint";
        if(!style) style = "text-align: right;"
        let html = "<input type='text'";
        html += (name?" name=\""+name+"\"":"");
        html += (id?" id=\""+id+"\"":"");
        html += (clazz?" class=\""+clazz+"\"":"");
        html += (style?" style=\""+style+"\"":"");
        html += " size='"+size+"'";
        if(!max) max = size;
        html += " maxlength='"+max+"'";
        if(readonly) html += " readonly ";
        if(disabled) {
            if("true"==disabled) html += " disabled ";
            else if("false"!=disabled) html += " disabled=\""+disabled+"\" ";
        } 
        if(value) { 
            html += " value=\""+value+"\"";
        }
        html += " onkeypress=\"return fs_intNumsOnly(this,event)\"";
        html += " />";
        return html;
    }

    public createTagMoney(options?: any) : string {
        let value = options?.value;
        let name = options?.name;
        let id = options?.id;
        if(!id) id = name;
        let clazz = options?.class;
        let style = options?.style;
        let disabled = options?.disabled;
        let readonly = options?.readonly;
        let size = options?.size;
        let decimal = options?.decimal || 2;
        let minus = options?.minus || true;
        if(!clazz) clazz = "";
        if(clazz.indexOf("imoney")<0) clazz += " imoney";
        if(!style) style = "text-align: right;"
        let html = "<input type='text'";
        html += (name?" name=\""+name+"\"":"");
        html += (id?" id=\""+id+"\"":"");
        html += (clazz?" class=\""+clazz+"\"":"");
        html += (style?" style=\""+style+"\"":"");
        if(readonly) html += " readonly ";
        if(disabled) {
            if("true"==disabled) html += " disabled ";
            else if("false"!=disabled) html += " disabled=\""+disabled+"\" ";
        } 
        if(value) { 
            html += " value=\""+value+"\"";
        }
        html += " decimal='"+decimal+"'";
        html += " onkeyup=\"return fs_chkKey(this,"+(size?'"+size+"':"null")+",'"+decimal+"',event)\"";
        html += " onkeypress=\"return fs_intNumsOnly_chkKey(this,event,'"+decimal+"'"+(minus?",true":"")+")\"";
        html += " />";
        return html;
    }

    public serializeInactive(inactive: string = "0") : string {
        return "1"==inactive?"<em class=\"fa fa-ban\" aria-hidden=\"true\"></em>":"<em class=\"fa fa-check-square-o\" aria-hidden=\"true\"></em>";
    }

    public serializeChecker(checkflag: string = "0") : string {
        return "1"==checkflag?"<em class=\"fa fa-check-circle\" aria-hidden=\"true\"></em>":"<em class=\"fa fa-circle-o\" aria-hidden=\"true\"></em>";
    }
    
}
