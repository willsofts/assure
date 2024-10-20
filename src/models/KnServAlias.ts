import { KnDataMapEntitySetting } from "../models/KnCoreAlias";

export const OPERATE_HANDLERS: { name: string; }[] = [ {name: "get"}, {name: "html"}, {name: "categories"}, {name: "search"}, {name: "add"}, {name: "retrieval"}, {name: "view"}, {name: "entry"}, {name: "edit"} ];
export const QUERY_MODES: string[] = ["collect", "find", "list", "search", "query", "inquiry", "enquiry"];

export interface KnMetaInfo {
    api_url: string;
    base_url: string; 
    cdn_url: string;
    img_url: string;
    redirect_url: string; 
    message_url: string;
    language: string;
    version: string;
    raw_parameters: boolean;
    token?: string;
    storage?: string;
    secure_storage?: boolean,
    chat_url?: string,
    base_css?: string,
    info?: any;
}

export interface KnHeaderInfo {
    pid: string;
    title: string;
    addon?: string;
    versionLabel?: string;
    increaseLabel?: string;
    decreaseLabel?: string;
    inline?: boolean;
    info?: any;
}

export interface KnPagingInfo {
    totalRows?: number;
    jsForm: string;
    jsFunction?: string;
    searchForm?: string;
    inline?: boolean;
    info?: any;
}

export interface KnCategorySetting {
    [name: string] : KnDataMapEntitySetting;
}

export interface KnConfigMapperSetting {
    category: string;
    colname: string;
    fieldname: string;
    columnOnly: boolean;
    altercolnames?: string[];
    boolflag?: boolean;
    options?: any;
}
