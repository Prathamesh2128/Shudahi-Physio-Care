const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || "hms_access_token";

// Access token lives in memory (JS variable) — most secure
// We use sessionStorage as a fallback for page refresh
let inMemoryToken = null;

export const tokenUtils = {
  setToken(token) {
    inMemoryToken = token;
    // Store in sessionStorage so page refresh doesn't log out
    // (NOT localStorage — tab-scoped, cleared on tab close)
    sessionStorage.setItem("TOKEN_KEY", token);
  },

  getToken() {
    if (inMemoryToken) return inMemoryToken;
    // Re-hydrate from sessionStorage on page refresh
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (stored) {
      inMemoryToken = stored;
      return stored;
    }
    return null;
  },

  clearToken() {
    inMemoryToken = null;
    sessionStorage.removeItem(TOKEN_KEY);
  },

  // Decode JWT payload (no signature verification — that's the server's job)
  decodePayload(token) {
    try {
      const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const json = atob(base64);
      return JSON.parse(json);
    } catch {
      return null;
    }
  },

  isExpired(token) {
    const payload = this.decodePayload(token);
    if (!payload?.exp) return true;

    // 30-second buffer before actual expiry
    return Date.now() >= (payload.exp - 30) * 1000;
  },

  getExpiresIn(token) {
    const payload = this.decodePayload(token);
    if (!payload?.exp) return 0;
    return Math.max(0, payload.exp * 1000 - Date.now());
  },
};
