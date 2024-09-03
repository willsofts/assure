var fs_current_domainid;
function startSSO(domainid) {
    fs_current_domainid = domainid;
    startWaiting();
    jQuery.ajax({
        url: BASE_URL+"/auth/config/"+domainid,
        type: "POST",
        data: {ajax: true}, 
        dataType: "json",
        contentType: defaultContentType,
        error : function(transport,status,errorThrown) { 
            stopWaiting();
            errorThrown = parseErrorThrown(transport, status, errorThrown);
            alertbox(errorThrown);
        },
        success: function(data,status,xhr){ 
            console.log("success : "+xhr.responseText);
            stopWaiting();
            trySSOLogin(data);
        }
    });			
}
function trySSOLogin(data) {
    msalConfig.auth = {...data.body.config.auth, authType: data.body.type};
    console.log("auth config",msalConfig.auth);
    delete msalConfig.auth.clientSecret;
    msalObject = new msal.PublicClientApplication(msalConfig);
    msalObject.handleRedirectPromise()
    .then(ssoHandleResponse)
    .catch((error) => {
        console.error(error);
    });
    ssoSignIn();
}

const msalConfig = {
    auth: {
        clientId: "",
        authority: "",
        redirectUri: "",
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {	
        loggerOptions: {	
            loggerCallback: (level, message, containsPii) => {	
                if (containsPii) {		
                    return;		
                }		
                switch (level) {		
                    case msal.LogLevel.Error:		
                        console.error(message);		
                        return;		
                    case msal.LogLevel.Info:		
                        console.info(message);		
                        return;		
                    case msal.LogLevel.Verbose:		
                        console.debug(message);		
                        return;		
                    case msal.LogLevel.Warning:		
                        console.warn(message);		
                        return;		
                }	
            }	
        }	
    }
};
const loginRequest = {
    scopes: []
};

let msalObject = null;
let username = "";
let ssoSignedIn = false;
function ssoSelectAccount () {
    if(!msalObject) return;
    const currentAccounts = msalObject.getAllAccounts();
    console.log("ssoSelectAccount:",currentAccounts);
    if (currentAccounts.length === 0) {
        return;
    } else if (currentAccounts.length > 1) {
        console.warn("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {
        ssoSignedIn = true;
        let acct = currentAccounts[0];
        username = acct.username;
        if(!username || username=="") {
            username = response.account.idTokenClaims.given_name;
        }
        tryLogIn(username,acct.tenantId);
    }
}
function ssoHandleResponse(response) {
    console.log("ssoHandleResponse:",response);
    if (response !== null) {
        ssoSignedIn = true;
        username = response.account.username;
        if(!username || username=="") {
            username = response.account.idTokenClaims.given_name;
        }
        tryLogIn(username,response.tenantId,response.accessToken);
    } else {
        ssoSelectAccount();
    }
}
function ssoSignIn() {
    if(!msalObject) return;
    msalObject.loginPopup(loginRequest)
        .then(ssoHandleResponse)
        .catch(error => {
            console.error(error);
        });
}
function ssoSignOut() {
    if(!msalObject) throw new Error("Configuration not found");
    if(!ssoSignedIn) throw new Error("Account does not signed in");
    let homeurl = window.location.protocol+"//"+window.location.hostname+(window.location.port ? ':'+window.location.port: '')+"/";
    console.log("homeurl",homeurl);
    const logoutRequest = {
        account: msalObject.getAccountByUsername(username),
        postLogoutRedirectUri: msalConfig.auth.redirectUri || homeurl,
        mainWindowRedirectUri: msalConfig.auth.redirectUri || homeurl
    };
    console.log("logoutRequest",logoutRequest);
    msalObject.logoutPopup(logoutRequest).then(() => {
        ssoSignedIn = false;
        username = "";
    });
    return true;
}
function getTokenPopup(request) {
    request.account = msalObject.getAccountByUsername(username);    
    return msalObject.acquireTokenSilent(request)
        .catch(error => {
            console.warn("silent token acquisition fails. acquiring token using popup");
            if (error instanceof msal.InteractionRequiredAuthError) {
                return msalObject.acquireTokenPopup(request)
                    .then(tokenResponse => {
                        console.log(tokenResponse);
                        return tokenResponse;
                    }).catch(error => {
                        console.error(error);
                    });
            } else {
                console.warn(error);   
            }
    });
}
function tryLogIn(username,tenant,token) {
    console.log("tryLogin: username="+username+", domainid="+fs_current_domainid+", tenant="+tenant+", token="+token);
    startWaiting();
    jQuery.ajax({
        url: API_URL+"/api/sign/access",
        type: "POST",
        contentType: defaultContentType,
        data: {username: username, domainid: fs_current_domainid, accesstoken: token}, 
        dataType: "html",
        error : function(transport,status,errorThrown) { 
            stopWaiting();
            errorThrown = parseErrorThrown(transport, status, errorThrown);
            alertbox(errorThrown);
        },
        success: function(data,status,xhr){ 
            console.log("success : "+xhr.responseText);
            stopWaiting();
            loginSuccess(data);
        }
    });			
}
function doSSOLogout() {
    ssoSignOut();
}
