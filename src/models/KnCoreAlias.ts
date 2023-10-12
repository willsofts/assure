import { KnOperationInfo, KnDBField } from "@willsofts/will-db";
import { KnResultSet } from "@willsofts/will-sql";

export const RESERVED_PARAMETERS: string[] = ["program", "subprog", "language", "authtoken", "action", "caption", "ciphertext"];
export const RESERVED_FIELDS: string[] = ["authtoken","ciphertext","language","tokenkey"];
export const INSERT_MODES: string[] = ["create", "insert", "add", "entry", "enter", "entrance"];
export const UPDATE_MODES: string[] = ["retrieve", "find", "list", "get", "query", "view", "search", "retrieval", "edit", "update", "modify"];
export const RETRIEVE_MODES: string[] = ["retrieve", "get", "retrieval", "edit", "view", "query"];
export const DELETE_MODES: string[] = ["delete", "remove", "reset", "erase", "clear"];
export const COLLECT_MODES: string[] = ["collect", "find", "list", "query", "search", "inquiry", "enquiry"];

export interface KnLoginInfoContents {
	authToken: string;
	userUuid: string;
	textures: any[];
	email: string;
	displayName: string;
	userPrincipalName: string;
	userContents: any;
	accessContents: any;
    info?: any;
}

export interface KnLogoutInfoContents {
	authToken: string
}

export interface KnAnonymousInfoContents {
	userUuid: string;
	authToken: string;
}

export interface KnContextInfo {
    params: any;
    meta: any;
    options?: any;
}

export interface KnAuthorizationInfo {
    authorization: string;
    client?: string;
}

export interface KnSigninInfo {
    username: string;
    password: string;
    site?: string;
}

export interface KnDiffieInfo {
    prime: string; 
    generator: string;
    publickey: string;
}

export interface KnUserAccessInfo {
    userid: string;
    site?: string;
    code?: string;
    state?: string;
    nonce?: string;
    loginfo?: Object;
}

export interface KnAccessingInfo {
    userid?: string;
    username?: string;
    lockflag?: string;
}

export interface KnCipherData {
    data: string;
}

export interface KnValidateInfo {
    valid: boolean;
    info?: string;
    options?: any;
}

export interface KnDataSet {
    [name: string]: any;
}

export interface KnDataEntity {
    [name: string]: KnDataSet;
}

export interface KnDataTable {
    action: string;
    dataset: KnDataSet;    
    entity: KnDataEntity | Array<any>;
    meta?: KnDataSet;
    renderer?: string;
    error?: any;
}

export interface KnDataTableSetting {
    tableName: string;
    keyField: string;
    addonFields?: string;
    orderFields?: string;
    checkActive?: boolean;
    checkSite?: boolean;
    siteOnly?: boolean;
    addonFilters?: string;
    captionFields?: string;
    nameen?: string;
    nameth?: string;
    options?: any;
}

export interface KnDataTableResultSet {
    tablename: string;
    resultset: KnResultSet;
    options?: any;
}

export interface KnDataMapSetting {
    keyName: string;
    valueNames: string[];
    groupId?: string;
    groupNames?: string[];
    categoryName?: string;
    options?: any;
}

export interface KnDataMapEntitySetting extends KnDataTableSetting {
    setting?: KnDataMapSetting;
}

export interface KnDataMapRecordSetting extends KnDataTableResultSet {
    setting: KnDataMapSetting;
}

export interface KnFormatInfo {
    name?: string;
    value: any;
    rs?: any;
    field?: KnDBField;
}

export interface KnLabelItem {
    name: string;
    value: string;
}

export interface KnLabelData {
    language: string;
    label: KnLabelItem[];
}

export interface KnFunctionalInfo extends KnOperationInfo {
    raw: boolean;
}

export interface KnTemplateInfo {
    subjecttitle: string;
    contents: string;
    contexts: string;
    info?: any;
}

export interface KnUserInfo {
    found: boolean;
    userid: string;
    email: string;
    site?: string;
    username?: string;
    userpassword?: string;
    usernameen?: string;
    usernameth?: string;
    info?: any;
}

export interface KnActivateInfo {
    activatekey: string;
    activateuser: string;
    transtime: number;
    expiretime: number;
    activatecount: number;
    activatetimes: number;
    expiredate?: Date;
    activatecategory?: string;
    activatestatus?: string;
    activatelink?: string;
    activatepage?: string;
    activateremark?: string;
    activateparameter?: string;
    activatemessage?: string;
    activatecontents?: string;
    activatedate?: Date;
    activatetime?: Date;
    info?: any;
}

export interface KnFactorConfigInfo {
    factorconfig: boolean;
    factorverify: boolean;
    issuer: string;
    info?: any;
}

export interface KnFactorInfo extends KnFactorConfigInfo {
    userid: string;
    email: string;
    factorfound: boolean;
    factorid: string;
    factorkey: string;
    factorflag: string;
    factorurl?: string;
    factorremark?: string;
    factorimage?: string;
}

export interface KnFactorTokenInfo {
    valid: boolean;
    token: string;
    info?: any;
}

export interface KnFactorVerifyInfo {
    verified: boolean;
    delta: number;
    info?: any
}

export interface KnTrailerInfo {
    keyid: string;
    trxstatus: string;
    trxtime?: number;
    processtype?: string;
    quotable?: string;
    refer?: string;
    package?: string;
    grouper?: string;
    remark?: string;
    info?: any;
}

export interface KnTrailingInfo extends KnTrailerInfo{
    owner: string;
    sender: string;
    contents: string;
    caller?: string;
    note?: string;
    action?: string;
    attachs?: string;
}

export interface KnMailSetting {
    channel: string | string[];
    target: string | string[];
    subject: string;
    message: string;
    options?: any;
}

export enum KnChannel {
    MAIL = "mail",
    NOTI = "noti",
    SMS = "sms",
    LINE = "line"
}

export interface KnChannelInfo {
    channel: string;
    action?: string;
    info?: any;
}
