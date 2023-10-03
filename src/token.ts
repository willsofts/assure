import { Arguments } from "@willsofts/will-util";
import { AuthenToken } from "@willsofts/will-lib";
import { v4 as uuid } from 'uuid';

let args = process.argv.slice(2);
let useruuid = Arguments.getString(args,uuid(),"-uuid");
let site = Arguments.getString(args,"FWS","-site");
let userid = Arguments.getString(args,"tester","-user");
let expired = Arguments.getString(args,"24h","-expire"); 
let token = AuthenToken.createAuthenToken({identifier:useruuid as string, site:site, accessor:userid},expired);
console.log(token);
