import { defineComposable } from "../core/defineComposable";

interface UnifiedTokenComposableConfig {
    accessToken: string | (() => Promise<string> | string);
    refreshToken: string | (() => Promise<string> | string);
    refreshTokenExpiresAt?: number;
    refreshOnStatusCodes?: number[];
    tokenEndpoint: string;
    refreshTokenURL?: string; // Optional if different from tokenEndpoint
    clientId: string;
    clientSecret?: string;
    scopes?: string[]; // Optional based on auth server requirements
    grantType?: string; // Optional, e.g., "refresh_token"
    userAgent?: string; // Optional, for APIs requiring a User-Agent header
    onTokenRefresh?: (newAccessToken: string, newRefreshToken?: string) => void;
    onRefreshError?: (error: any) => void;
}

// Authorization Code Grant
// AKA get a new access token using the client id and client secret

// Refresh Token Grant
// AKA get a new access token using the refresh token

//

export function useOAuth2({
    accessToken,
    refreshToken,
    onTokenRefresh,
    refreshOnStatusCodes = [401, 422],
}: UnifiedTokenComposableConfig) {
    return defineComposable({
        async beforeRequest(config) {
            // Add OAuth2 token to request
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${accessToken}`,
            };
            return config;
        },
        async onError(error, { config, retry }) {
            if (refreshOnStatusCodes.includes(error.status)) {
                // Refresh token
                let newAccessToken;
                if (onRefreshToken) {
                    newAccessToken = await onRefreshToken(refreshToken);
                }
                // Try to refresh the token using the default strategy
                else {
                    newAccessToken = refreshToken;
                }

                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${newAccessToken}`,
                };

                return retry();
            }
            throw error;
        },
    });
}

// THIS IS A TODO
// PKCE ================================================
// Proof Key for Code Exchange

async function generatePKCEParameters() {
    function base64urlEncode(value: ArrayBuffer) {
        return btoa(String.fromCharCode(...new Uint8Array(value)))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    }

    function generateCodeVerifier(length = 128) {
        const array = new Uint8Array(length);
        window.crypto.getRandomValues(array);
        return base64urlEncode(array).substring(0, length);
    }

    async function deriveCodeChallenge(codeVerifier: string) {
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await window.crypto.subtle.digest("SHA-256", data);
        return base64urlEncode(digest);
    }

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await deriveCodeChallenge(codeVerifier);

    return { codeVerifier, codeChallenge };
}

export function usePKCE() {
    let codeVerifier = "";
    let codeChallenge = "";

    const initializePKCE = async () => {
        const pkceParameters = await generatePKCEParameters();
        codeVerifier = pkceParameters.codeVerifier;
        codeChallenge = pkceParameters.codeChallenge;
    };

    return defineComposable({
        async beforeRequest(config) {
            // Ensure PKCE parameters are generated before the first OAuth request
            if (!codeVerifier || !codeChallenge) {
                await initializePKCE();
                // Assuming config object has a way to pass these parameters along with the request
                config.codeChallenge = codeChallenge;
                // Note: codeVerifier is used later in the token exchange process, not added to initial requests
            }

            return config;
        },
        afterResponse(response) {
            // Use this hook if you need to handle anything after receiving the response
            // For PKCE, this might not be necessary unless you're tracking state between requests
            return response;
        },
        // onError and finalize hooks can be implemented as needed
    });
}
