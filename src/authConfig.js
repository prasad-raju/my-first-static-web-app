import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: "52d713be-d080-4419-9c58-0337ceb65d44",
        authority: "https://testmyad1982.b2clogin.com/testmyad1982.onmicrosoft.com/B2C_1_signupsigninTest1",
        knownAuthorities: ['testmyad1982.b2clogin.com'],
        redirectUri: "https://ashy-mud-07dc67310.1.azurestaticapps.net"
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    // system: {	
    //     loggerOptions: {	
    //         loggerCallback: (level, message, containsPii) => {	
    //             if (containsPii) {		
    //                 return;		
    //             }		
    //             switch (level) {		
    //                 case LogLevel.Error:		
    //                     console.error(message);		
    //                     return;		
    //                 case LogLevel.Info:		
    //                     console.info(message);		
    //                     return;		
    //                 case LogLevel.Verbose:		
    //                     console.debug(message);		
    //                     return;		
    //                 case LogLevel.Warning:		
    //                     console.warn(message);		
    //                     return;		
    //             }	
    //         }	
    //     }	
    // }
};

export const loginRequest = {
    scopes: ["openid"]
};