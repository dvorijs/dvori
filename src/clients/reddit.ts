import { defineClient } from "../core/defineClient";
import { useOAuth2 } from "../composables/useOAuth2";

const API_BASE_URL = "https://oauth.reddit.com";
const REFRESH_TOKEN_BASE_URL = "https://ssl.reddit.com";

const redditOAuth2 = useOAuth2({
    accessToken: "TODO: Add Reddit OAuth2 access token",
    refreshToken: "TODO: Add Reddit OAuth2 refresh token",
    redirectUri: "http://localhost:3000",
    userAgent: "dvori",
});

export const redditClient = defineClient({
    baseURL: API_BASE_URL,
    composables: [redditOAuth2],
});
