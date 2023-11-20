import { Request, Response } from 'express';
import msal from '@azure/msal-node';
import axios from 'axios';
import { SAMLConfigure } from './AuthenAlias';

export class AuthenProvider {
    public msalConfig: SAMLConfigure;
    public cryptoProvider: msal.CryptoProvider;
    constructor(msalConfig: SAMLConfigure) {
        this.msalConfig = msalConfig;
        this.cryptoProvider = new msal.CryptoProvider();
    }

    public login(options: any = {}) {
        return async (req: Request, res: Response, next: Function) => {
            const state = this.cryptoProvider.base64Encode(
                JSON.stringify({
                    successRedirect: options.successRedirect || '/',
                })
            );

            const authCodeUrlRequestParams = {
                state: state,
                scopes: options.scopes || [],
                redirectUri: options.redirectUri,
            };

            const authCodeRequestParams = {
                state: state,
                scopes: options.scopes || [],
                redirectUri: options.redirectUri,
            };

            if (typeof this.msalConfig.auth.validateAuthority === 'undefined') { 
                if (!this.msalConfig.auth.cloudDiscoveryMetadata || !this.msalConfig.auth.authorityMetadata) {

                    const [cloudDiscoveryMetadata, authorityMetadata] = await Promise.all([
                        this.getCloudDiscoveryMetadata(this.msalConfig.auth.authority),
                        this.getAuthorityMetadata(this.msalConfig.auth.authority)
                    ]);

                    this.msalConfig.auth.cloudDiscoveryMetadata = JSON.stringify(cloudDiscoveryMetadata);
                    this.msalConfig.auth.authorityMetadata = JSON.stringify(authorityMetadata);
                }
            }
            
            const msalInstance = this.getMsalInstance(this.msalConfig);

            // trigger the first leg of auth code flow
            return this.redirectToAuthCodeUrl(
                authCodeUrlRequestParams,
                authCodeRequestParams,
                msalInstance
            )(req, res, next);
        };
    }

    public acquireToken(options: any = {}) {
        return async (req: any, res: any, next: Function) => {
            try {
                const msalInstance = this.getMsalInstance(this.msalConfig);

                if (req.session.tokenCache) {
                    msalInstance.getTokenCache().deserialize(req.session.tokenCache);
                }

                const tokenResponse = await msalInstance.acquireTokenSilent({
                    account: req.session.account,
                    scopes: options.scopes || [],
                });

                console.log(this.constructor.name+".acquireToken: tokenResponse",tokenResponse);
                req.session.tokenCache = msalInstance.getTokenCache().serialize();
                req.session.accessToken = tokenResponse.accessToken;
                req.session.idToken = tokenResponse.idToken;
                req.session.account = tokenResponse.account;
                req.session.isAuthenticated = true;
                console.log(this.constructor.name+".acquireToken: successRedirect",options.successRedirect);
                res.redirect(options.successRedirect);
            } catch (error) {
                if (error instanceof msal.InteractionRequiredAuthError) {
                    return this.login({
                        scopes: options.scopes || [],
                        redirectUri: options.redirectUri,
                        successRedirect: options.successRedirect || '/',
                    })(req, res, next);
                }

                next(error);
            }
        };
    }

    public handleRedirect(options: any = {}) {
        return async (req: any, res: Response, next: Function) => {
            if (!req.body || !req.body.state) {
                return next(new Error('Error: response not found'));
            }

            const authCodeRequest = {
                ...req.session.authCodeRequest,
                code: req.body.code,
                codeVerifier: req.session.pkceCodes.verifier,
            };

            try {
                const msalInstance = this.getMsalInstance(this.msalConfig);

                if (req.session.tokenCache) {
                    msalInstance.getTokenCache().deserialize(req.session.tokenCache);
                }

                const tokenResponse = await msalInstance.acquireTokenByCode(authCodeRequest, req.body);

                req.session.tokenCache = msalInstance.getTokenCache().serialize();
                req.session.idToken = tokenResponse.idToken;
                req.session.account = tokenResponse.account;
                req.session.isAuthenticated = true;

                const state = JSON.parse(this.cryptoProvider.base64Decode(req.body.state));
                console.log(this.constructor.name+".handleRedirect: "+state.successRedirect);
                res.redirect(state.successRedirect);
            } catch (error) {
                next(error);
            }
        }
    }

    public logout(options: any = {}) {
        return (req: Request, res: Response, next: Function) => {
            let logoutUri = `${this.msalConfig.auth.authority}/oauth2/v2.0/`;

            if (options.postLogoutRedirectUri) {
                logoutUri += `logout?post_logout_redirect_uri=${options.postLogoutRedirectUri}`;
            }
            console.log(this.constructor.name+".logout: "+logoutUri);
            req.session.destroy(() => {
                res.redirect(logoutUri);
            });
        }
    }

    /**
     * Instantiates a new MSAL ConfidentialClientApplication object
     * @param msalConfig: MSAL Node Configuration object 
     * @returns 
     */
    public getMsalInstance(msalConfig: SAMLConfigure) {
        return new msal.ConfidentialClientApplication(msalConfig);
    }


    /**
     * Prepares the auth code request parameters and initiates the first leg of auth code flow
     * @param req: Express request object
     * @param res: Express response object
     * @param next: Express next function
     * @param authCodeUrlRequestParams: parameters for requesting an auth code url
     * @param authCodeRequestParams: parameters for requesting tokens using auth code
     */
    public redirectToAuthCodeUrl(authCodeUrlRequestParams: any, authCodeRequestParams: any, msalInstance: msal.ConfidentialClientApplication) {
        return async (req: any, res: Response, next: Function) => {
            // Generate PKCE Codes before starting the authorization flow
            const { verifier, challenge } = await this.cryptoProvider.generatePkceCodes();

            // Set generated PKCE codes and method as session vars
            req.session.pkceCodes = {
                challengeMethod: 'S256',
                verifier: verifier,
                challenge: challenge,
            };

            req.session.authCodeUrlRequest = {
                ...authCodeUrlRequestParams,
                responseMode: msal.ResponseMode.FORM_POST, // recommended for confidential clients
                codeChallenge: req.session.pkceCodes.challenge,
                codeChallengeMethod: req.session.pkceCodes.challengeMethod,
            };

            req.session.authCodeRequest = {
                ...authCodeRequestParams,
                code: '',
            };

            try {
                const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(req.session.authCodeUrlRequest);
                console.log(this.constructor.name+".redirectToAuthCodeUrl: authCodeUrlResponse",authCodeUrlResponse);
                res.redirect(authCodeUrlResponse);
            } catch (error) {
                next(error);
            }
        };
    }

    /**
     * Retrieves cloud discovery metadata from the /discovery/instance endpoint
     * @returns 
     */
    public async getCloudDiscoveryMetadata(authority: string) {
        const endpoint = 'https://login.microsoftonline.com/common/discovery/instance';
        console.log(this.constructor.name+".getCloudDiscoveryMetadata: endpoint",endpoint);
        try {
            const response = await axios.get(endpoint, {
                params: {
                    'api-version': '1.1',
                    'authorization_endpoint': `${authority}/oauth2/v2.0/authorize`
                }
            });

            return await response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Retrieves oidc metadata from the openid endpoint
     * @returns
     */
    public async getAuthorityMetadata(authority: string) {
        const endpoint = `${authority}/v2.0/.well-known/openid-configuration`;
        console.log(this.constructor.name+".getAuthorityMetadata: endpoint",endpoint);
        try {
            const response = await axios.get(endpoint);
            return await response.data;
        } catch (error) {
            console.log(error);
        }
    }

}
