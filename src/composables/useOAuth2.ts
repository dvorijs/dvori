import { defineComposable } from "../core/defineComposable";

interface UseOAuth2Props {
    accessToken: string;
    refreshToken: string;
    redirectUri: string;
    userAgent: string;

    refreshOnStatusCodes?: number[];
    onRefreshToken?: (refreshToken: string) => string;
}

export function useOAuth2({
    accessToken,
    refreshToken,
    onRefreshToken,
    refreshOnStatusCodes = [401, 422],
}: UseOAuth2Props) {
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
