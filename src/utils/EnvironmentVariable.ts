import os from "os";
import config from "@willsofts/will-util";

export const API_URL: string = config.env("API_URL","");
export const BASE_URL: string = config.env("BASE_URL","");
export const CDN_URL: string = config.env("CDN_URL","");
export const MESSAGE_URL: string = config.env("MESSAGE_URL","");
export const REDIRECT_URL: string = config.env("REDIRECT_URL",""); 
export const RELEASE_VERSION: string = config.env("RELEASE_VERSION","v1.0.0");
export const BASE_STORAGE: string = config.env("BASE_STORAGE","");
export const ALLOW_AUTHEN_SAML: boolean = config.env("ALLOW_AUTHEN_SAML") === "true";
export const REDIRECT_URI: string = config.env("REDIRECT_URI","http://localhost:8080/auth/redirect"); 
export const REDIRECT_URI_LOGOUT: string = config.env("REDIRECT_URI_LOGOUT","http://localhost:8080"); 

export const AUTH_TOKEN_EXPIRE_IN = config.env("AUTH_TOKEN_EXPIRE_IN","18h"); //18 hours expired
export const EXPIRE_TIMES = parseInt(config.env("EXPIRE_TIMES","64800000")) || 18*60*60*1000; //18 hours expired
export const EXPIRE_DATES = parseInt(config.env("EXPIRE_DATES","120")) || 120; //120 days expired
export const MAX_FAILURE = parseInt(config.env("MAX_FAILURE","3")) || 3;
export const MAX_WAITTIME = parseInt(config.env("MAX_WAITTIME","180000")) || 180000; //3 minutes (3x60x1000)

export const EXCEPT_AUTHORIZE_PATH: string = config.env("EXCEPT_AUTHORIZE_PATH");
export const UPLOAD_RESOURCES_PATH: string = config.env("UPLOAD_RESOURCES_PATH") || os.tmpdir();
export const NEWS_URL_ALWAYS_OPEN: boolean = config.env("NEWS_URL_ALWAYS_OPEN") === "true";
export const AUTHEN_BY_VERIFY_DOMAIN: boolean = config.env("AUTHEN_BY_VERIFY_DOMAIN","false") === "true";
export const VALIDATE_TOKEN: boolean = config.env("VALIDATE_TOKEN","true") === "true";
export const VALIDATE_TOKEN_NOT_FOUND: boolean = config.env("VALIDATE_TOKEN_NOT_FOUND","true") === "true";
export const VALIDATE_ANOMYMOUS_TOKEN: boolean = config.env("VALIDATE_ANOMYMOUS_TOKEN","true") === "true";
export const ALWAYS_VALIDATE_TOKEN: boolean = config.env("ALWAYS_VALIDATE_TOKEN","true") === "true";
export const ALWAYS_DB_TRACKING: boolean = config.env("ALWAYS_DB_TRACKING","true") === "true";
export const DB_SECTION: string = config.env("DB_SECTION","MYSQL");
export const DB_TRACKER: string = config.env("DB_TRACKER","MYSQL");

export const DEFAULT_LANGUAGE: string = config.env("DEFAULT_LANGUAGE","EN");
export const DEFAULT_INVALIDATE_TIMES = parseInt(config.env("DEFAULT_INVALIDATE_TIMES","300000")) || 5*60*1000; //5 minutes expired
export const DEFAULT_ACCOUNT_INVALIDATE_TIMES = parseInt(config.env("DEFAULT_ACCOUNT_INVALIDATE_TIMES","2592000000")) || 30*24*60*60*1000; //30 days expired
export const DEFAULT_ONETIME_LENGTH = parseInt(config.env("DEFAULT_ONETIME_LENGTH","6")) || 6;

export const DISPLAY_FONT_CONTROL: boolean = config.env("DISPLAY_FONT_CONTROL","false") === "true";
export const DISPLAY_VERSION_CONTROL: boolean = config.env("DISPLAY_VERSION_CONTROL","true") === "true";
export const DISPLAY_PROGRAM_CONTROL: boolean = config.env("DISPLAY_PROGRAM_CONTROL","true") === "true";

export const EXCEPT_LAUNCH_PATH: string = config.env("EXCEPT_LAUNCH_PATH","page_forgot");
export const DEFAULT_PRIVILEGES: string = config.env("DEFAULT_PRIVILEGES","OPERATOR");
