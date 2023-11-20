export interface AuthorityConfigure {
    clientId: string;
    authority: string;
    clientSecret: string;
    authorityMetadata?: string;
    cloudDiscoveryMetadata?: string;
    authorityDomain?: string;
    authoritySignin?: string;
    authorityReset?: string;
    authorityProfile?: string;
    logoutEndpoint?: string;
    knownAuthorities?: string[];
    validateAuthority?: boolean;
}

export interface SAMLConfigure {
    auth: AuthorityConfigure;
    system: any;
}

export interface ADConfigure {
    type: string;
    config: SAMLConfigure;
    url?: string;
    name?: string;
}
