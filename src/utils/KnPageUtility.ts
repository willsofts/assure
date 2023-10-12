import { Utilities } from "@willsofts/will-util";
import { KnUtility } from "./KnUtility";
import { KnContextInfo, KnFormatInfo, INSERT_MODES, UPDATE_MODES, RETRIEVE_MODES, DELETE_MODES, COLLECT_MODES } from "../models/KnCoreAlias";

export class KnPageUtility {
    public progid : string;
    public context: KnContextInfo;

    constructor(progid: string, context: KnContextInfo) {
        this.progid = progid;
        this.context = context;
    }

    public isEnglish() : boolean {
        return this.isLanguage("EN");
    }

    public isThai() : boolean {
        return this.isLanguage("TH");
    }

    public isLanguage(language: string) : boolean {
        return language==KnUtility.getDefaultLanguage(this.context);
    }

	public isExecuteMode(mode: string) : boolean {
		return mode==this.context?.params?.action;
	}

	public isInsertMode(mode?: string) : boolean {
		if(mode) {
			return INSERT_MODES.includes(mode);
		}
        if(!mode) mode = this.context?.params?.action;
        return mode?INSERT_MODES.includes(mode):false;
    }

	public isUpdateMode(mode?: string) : boolean {
		if(mode) {
			return UPDATE_MODES.includes(mode);
		}
        if(!mode) mode = this.context?.params?.action;
        return mode?UPDATE_MODES.includes(mode):false;
    }

	public isRetrieveMode(mode?: string) : boolean {
		if(mode) {
			return RETRIEVE_MODES.includes(mode);
		}
        if(!mode) mode = this.context?.params?.action;
        return mode?RETRIEVE_MODES.includes(mode):false;
    }
	
	public isDeleteMode(mode?: string) : boolean {
		if(mode) {
			return DELETE_MODES.includes(mode);
		}
        if(!mode) mode = this.context?.params?.action;
        return mode?DELETE_MODES.includes(mode):false;
    }

	public isCollectMode(mode?: string) : boolean {
		if(mode) {
			return COLLECT_MODES.includes(mode);
		}
        if(!mode) mode = this.context?.params?.action;
        return mode?COLLECT_MODES.includes(mode):false;
    }

    public format(info: KnFormatInfo) : any {
        return KnUtility.formatData(info);
    }

	public checked(checker: string, value: any) : string {
		if(Utilities.isString(value)) {
			return checker==value?"checked":"";
		}
		if(Array.isArray(value)) {
			return value.includes(checker)?"checked":"";
		}
		return "";
	}

	public selected(checker: string, value: any) : string {
		if(Utilities.isString(value)) {
			return checker==value?"selected":"";
		}
		if(Array.isArray(value)) {
			return value.includes(checker)?"selected":"";
		}
		return "";
	}
	
	public isEmpty(value: any) : boolean {
		if(Utilities.isString(value)) {
			return value.trim().length==0;
		}
		return value == null || value == undefined;
	}

}
