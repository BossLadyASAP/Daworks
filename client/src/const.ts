export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
// Returns null if environment variables are not configured (for local auth flow)
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  
  // If OAuth is not configured, return null (app uses local auth instead)
  if (!oauthPortalUrl || !appId) {
    return null;
  }
  
  try {
    const redirectUri = `${window.location.origin}/api/oauth/callback`;
    const state = btoa(redirectUri);

    const url = new URL(`${oauthPortalUrl}/app-auth`);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    return url.toString();
  } catch (error) {
    console.error("Failed to generate login URL:", error);
    return null;
  }
};
