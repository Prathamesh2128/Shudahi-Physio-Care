import { create } from "zustand";
import { tokenUtils } from "../utils/tokenUtils";

const useAuthStore = create((set, get) => ({
  // ── State ─────────────────────────────────────────────────────
  user: null, // { id, fullName, email, roles[], permissions[] }
  accessToken: null,
  isLoading: true, // true while hydrating from sessionStorage
  isAuthenticated: false,

  // ── Actions ───────────────────────────────────────────────────
  setAuth(accessToken, user) {
    tokenUtils.setToken(accessToken);
    set({
      accessToken,
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  updateUser(updatedUser) {
    set((state) => ({
      user: { ...state.user, ...updatedUser },
    }));
  },

  clearAuth() {
    tokenUtils.clearToken();
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading(isLoading) {
    set({ isLoading });
  },

  // ── Selectors ─────────────────────────────────────────────────
  getPermissions() {
    return get().user?.permissions || [];
  },

  getRoles() {
    return get().user?.roles || [];
  },

  hasPermission(slug) {
    return get().user?.permissions?.includes(slug) ?? false;
  },

  hasRole(role) {
    return get().user?.roles?.includes(role) ?? false;
  },
}));

export default useAuthStore;
