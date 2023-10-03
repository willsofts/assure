import { KnDataMapEntitySetting } from "@willsofts/will-core";

export const OPERATE_HANDLERS = [ {name: "get"}, {name: "html"}, {name: "categories"}, {name: "search"}, {name: "add"}, {name: "retrieval"}, {name: "view"}, {name: "entry"}, {name: "edit"} ];
export const QUERY_MODES = ["collect", "find", "list", "search", "query", "inquiry", "enquiry"];

export interface KnMetaInfo {
    api_url: string;
    base_url: string; 
    redirect_url: string; 
    message_url: string;
    language: string;
    version: string;
    token?: string;
}

export interface KnHeaderInfo {
    pid: string;
    title: string;
    addon?: string;
    versionLabel?: string;
    increaseLabel?: string;
    decreaseLabel?: string;
}

export interface KnPagingInfo {
    totalRows?: number;
    jsForm: string;
    jsFunction?: string;
    searchForm?: string;
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
}
