import { KnModel } from "@willsofts/will-db";
import { KnDBConnector, KnSQL, KnRecordSet } from '@willsofts/will-sql';
import { PasswordLibrary, PasswordPolicyInfo, PasswordVerify } from '@willsofts/will-lib';
import { HTTP } from "@willsofts/will-api";
import { VerifyError } from "../models/VerifyError";
import { KnContextInfo } from '../models/KnCoreAlias';
import { TknSchemeHandler } from "./TknSchemeHandler";

const bcrypt = require('bcrypt');

export class TknChangePasswordHandler extends TknSchemeHandler {
    public model : KnModel = { name: "tuser", alias: { privateAlias: this.section } };

    //declared addon actions name
    public handlers = [ {name: "change"}, {name: "policy"}, {name: "policies"} ];

    public async change(context: KnContextInfo) : Promise<KnRecordSet> {
        return this.callFunctional(context, {operate: "change", raw: false}, this.doChange);
    }

    public async policy(context: KnContextInfo) : Promise<{policy: string[]}> {
        return this.callFunctional(context, {operate: "policy", raw: false}, this.doPolicy);
    }

    public async policies(context: KnContextInfo) : Promise<PasswordPolicyInfo[]> {
        return this.callFunctional(context, {operate: "policies", raw: false}, this.doPolicies);
    }

    protected async doChange(context: KnContextInfo, model: KnModel) : Promise<KnRecordSet> {
        let vi = this.validateParameters(context.params,"userid","oldpassword","userpassword","confirmpassword");
        if(!vi.valid) {
            return Promise.reject(new VerifyError("Parameter not found ("+vi.info+")",HTTP.NOT_ACCEPTABLE,-16061));
        }
        let puserid = context.params.userid as string;
        let poldpass = context.params.oldpassword as string;
        let puserpass = context.params.userpassword as string;
        let pcnfpass = context.params.confirmpassword as string;
        const atoken = await this.getAuthenToken(context, true, true);
        if (atoken == undefined) {
            return Promise.reject(new VerifyError("Token is invalid",HTTP.UNAUTHORIZED,-16031));
        } 
        let db = this.getPrivateConnector(model); 
        try {
            let plib : PasswordLibrary = new PasswordLibrary();
            let ut = await plib.getUserTokenInfo(db, atoken.identifier);
            if(!ut.userid) {
                return Promise.reject(new VerifyError("Token not found",HTTP.UNAUTHORIZED,-16003)); 
            }
            puserid = ut.userid;
            let error = this.checkChangePassword(puserid, puserpass, pcnfpass);
            if(error) {
                return Promise.reject(error);
            }
            return await this.processChangePassword(db, puserid, puserpass, poldpass);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }          
    }

    public checkChangePassword(puserid: string, puserpass: string, pcnfpass: string) : VerifyError | null {
        if(puserid==null || puserid=="") {
            return new VerifyError("Invalid user or password",HTTP.NOT_ACCEPTABLE,-16033);
        }
        if(puserpass!=pcnfpass) {
            return new VerifyError("Confirm Password Mismatch",HTTP.NOT_ACCEPTABLE,-16034);
        }		
        if(puserpass == puserid) {
            return new VerifyError("Not allow password as same as user",HTTP.NOT_ACCEPTABLE,-16035);
        }		
        if(puserpass.length<3) {
            return new VerifyError("Password must be equal to or greater than 3 characters",HTTP.NOT_ACCEPTABLE,-16036);
        }
        return null;
    }
    
    public async processChangePassword(db: KnDBConnector, puserid: string, puserpass: string, poldpass: string) : Promise<KnRecordSet> {
        let sql = new KnSQL("select tuser.site,tuser.username,tuser.userpassword,tuserinfo.activeflag ");
        sql.append("from tuser left join tuserinfo on tuserinfo.userid = tuser.userid ");
        sql.append("where tuser.userid = ?userid ");
        sql.set("userid",puserid);
        this.logger.info(this.constructor.name+".processChangePassword",sql);
        let rs = await sql.executeQuery(db);
        this.logger.debug(this.constructor.name+".processChangePassword: rs",rs.rows.length);
        if(rs.rows && rs.rows.length>0) {
            let row = rs.rows[0];
            if(puserpass == row.username) {
                return Promise.reject(new VerifyError("Not allow password as same as user",HTTP.NOT_ACCEPTABLE,-16035));
            }
            if("1"==row.activeflag) {
                return Promise.reject(new VerifyError("Not allow active directory user change password",HTTP.NOT_ACCEPTABLE,-16037));
            }		
            let usrpass = row.userpassword;
            let validpass = bcrypt.compareSync(poldpass, usrpass);
            if(!validpass) {
                return Promise.reject(new VerifyError("Invalid user or password",HTTP.NOT_ACCEPTABLE,-16033));
            } else {
                let site = row.site;
                let verify = await this.changeUserPassword(db,puserid,poldpass,puserpass,site,new Date());
                this.logger.debug(this.constructor.name+".processChangePassword: verify",verify);
                if(verify && !verify.result) {
                    return Promise.reject(new VerifyError(verify.msg as string,HTTP.NOT_ACCEPTABLE,verify.errno));
                }
            }
        } else {
            return Promise.reject(new VerifyError("Invalid user or password",HTTP.NOT_ACCEPTABLE,-16033));
        }
        return this.createRecordSet();
    }

    public async changeUserPassword(db: KnDBConnector, userid: string, pwd: string, newpwd: string, site?: string, date?: Date) : Promise<PasswordVerify> {
        let result : PasswordVerify = { result: false, msg: null, errno: 0, args: null };
        try {
            await db.beginWork();
            try {
                let plib : PasswordLibrary = new PasswordLibrary();
                result = await plib.changePassword(db,site,userid,pwd,newpwd,date,'0');
                this.logger.debug(this.constructor.name+".changeUserPassword",result);
                await db.commitWork();    
            } catch(err : any) {
                this.logger.error(this.constructor.name,err);
                result.result = false;
                result.errno = -4000;
                if(err.errno) result.errno = err.errno;
                if (typeof err === "string") {
                    result.msg = err;
                } else {
                    result.msg = err.message;
                }
                await db.rollbackWork();
            }
        } catch(ex : any) {
            this.logger.error(this.constructor.name,ex);
            result.result = false;
            result.errno = -4100;
            if(ex.errno) result.errno = ex.errno;
            if (typeof ex === "string") {
                result.msg = ex;
            } else {
                result.msg = ex.message;
            }
        }
        return Promise.resolve(result);
    }

    protected async doPolicy(context: KnContextInfo, model: KnModel) : Promise<{policy: string[]}> {
        let db = this.getPrivateConnector(model);
        try {
            let plib : PasswordLibrary = new PasswordLibrary();
            let policy = await plib.getPasswordPolicy(db);
            let policies : string[] = [];
            for(let p of policy) {
                policies.push(p.text);
            }
            return {policy: policies};
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

    protected async doPolicies(context: KnContextInfo, model: KnModel) : Promise<PasswordPolicyInfo[]> {
        let db = this.getPrivateConnector(model);
        try {
            let plib : PasswordLibrary = new PasswordLibrary();
            return await plib.getPasswordPolicy(db);
        } catch(ex: any) {
            this.logger.error(this.constructor.name,ex);
            return Promise.reject(this.getDBError(ex));
        } finally {
            if(db) db.close();
        }
    }

}
