import { ADConfigure } from "./AuthenAlias";
import { KnSQL, KnDBConnector, KnResultSet } from '@willsofts/will-sql';
import config from "@willsofts/will-util";

export class AuthenConfig {
    
    public static createAuthInfo(row : any) : any {
        return {
            clientId: row.applicationid,
            authority: row.tenanturl,
            clientSecret: row.secretkey,
        }
    }

    public static createB2CAuthInfo(row : any) : any {
        return {
            clientId: row.applicationid,
            authority: row.tenanturl,
            clientSecret: row.secretkey,
            knownAuthorities: [row.basedn],
            validateAuthority: false,
        }
    }

    public static createADConfigure(rs: KnResultSet, creater?: Function) : ADConfigure | undefined {
        if(rs && rs.rows.length>0) {
            let row = rs.rows[0];
            let authcfg = row.domaintype=="B"?this.createB2CAuthInfo(row):this.createAuthInfo(row);
            if(creater) authcfg = creater.call(this,row);
            return {
                id: row.domainid,
                type: row.domaintype,
                config: {
                    auth: authcfg,
                    system: this.getSystemConfig()
                },
                url: row.basedn,
                name: row.domainname
            }                
        }
        return undefined;
    }

    public static getSystemConfig() {
        return {
            loggerOptions: {
                loggerCallback(loglevel: any, message: any, containsPii: any) {
                    console.log(message);
                },
                piiLoggingEnabled: false,
                logLevel: 3,
            }
        }    
    }

    public static async getADConfigure(db: KnDBConnector, domainid?: string, context?: any) : Promise<ADConfigure | undefined> {
        if(domainid && domainid.trim().length>0) {
            let knsql = new KnSQL();
            knsql.append("select * from tdirectory where domainid = ?domainid and inactive='0' and systemtype='W' ");
            knsql.set("domainid",domainid);
            let rs = await knsql.executeQuery(db,context);
            let config = this.createADConfigure(rs);
            if(config) return config;
        }
        return this.getDefaultADConfigure();
    }

    public static getDefaultADConfigure() : ADConfigure | undefined {
        if(config.has("SAML")) {
            let saml : ADConfigure = config.get("SAML");
            saml.config.system = this.getSystemConfig();
            return saml;
        }
        return undefined;
    }

}
