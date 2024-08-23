import { Arguments } from "@willsofts/will-util";
import { AuthenToken } from "@willsofts/will-lib";
import { v4 as uuid } from 'uuid';

let args = process.argv.slice(2);
let useruuid = Arguments.getString(args,uuid(),"-uuid");
let site = Arguments.getString(args,"FWS","-site");
let userid = Arguments.getString(args,"tester","-user");
let expired = Arguments.getString(args,"24h","-expire"); 
let authtoken = Arguments.getString(args,undefined,"-token"); 
let secret = Arguments.getString(args,undefined,"-secret"); 
let ignored = Arguments.getBoolean(args,false,"-ignore");
if(authtoken && authtoken.trim().length > 0) {
    let info = AuthenToken.verifyAuthenToken(authtoken,ignored,secret);
    console.log(info);
} else {
    let token = AuthenToken.createAuthenToken({identifier:useruuid as string, site:site, accessor:userid},expired,secret);
    console.log(token);
}
