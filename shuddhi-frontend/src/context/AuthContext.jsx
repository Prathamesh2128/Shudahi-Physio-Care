import React, {
    createContext, useCallback, useEffect, useRef,
} from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { authApi } from '../api/auth.api';
import { tokenUtils } from '../utils/tokenUtils';
import { ROUTES } from '../constants/routes';
import { ROLE_HOME } from '../constants/permissions';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const {
        setAuth, clearAuth, updateUser, setLoading,
        isAuthenticated,
    } = useAuthStore();

    const navigate = useNavigate();
    const refreshTimerRef = useRef(null);  // auto-refresh timer

    // ── Schedule silent token refresh ────────────────────────────
    const scheduleRefresh = useCallback((token) => {
        clearTimeout(refreshTimerRef.current);
        const msLeft = tokenUtils.getExpiresIn(token);
        // Refresh 60 seconds before expiry
        const delay = Math.max(msLeft - 60_000, 10_000);

        refreshTimerRef.current = setTimeout(async () => {
            try {
                const { data } = await authApi.refresh();
                const newToken = data.data.accessToken;
                const payload = tokenUtils.decodePayload(newToken);
                setAuth(newToken, {
                    id: payload.sub,
                    email: payload.email,
                    fullName: payload.fullName,
                    roles: payload.roles,
                    permissions: payload.permissions,
                });
                scheduleRefresh(newToken);
            } catch {
                clearAuth();
                navigate(ROUTES.LOGIN + '?session=expired');
            }
        }, delay);
    }, [setAuth, clearAuth, navigate]);

    // ── Hydrate session on app start ──────────────────────────────
    useEffect(() => {
        const token = tokenUtils.getToken();

        if (!token || tokenUtils.isExpired(token)) {
            // Try silent refresh via cookie
            authApi.refresh()
                .then(({ data }) => {
                    const newToken = data.data.accessToken;
                    const payload = tokenUtils.decodePayload(newToken);
                    setAuth(newToken, {
                        id: payload.sub,
                        email: payload.email,
                        fullName: payload.fullName,
                        roles: payload.roles,
                        permissions: payload.permissions,
                    });
                    scheduleRefresh(newToken);
                })
                .catch(() => {
                    clearAuth();
                });
        } else {
            const payload = tokenUtils.decodePayload(token);
            setAuth(token, {
                id: payload.sub,
                email: payload.email,
                fullName: payload.fullName,
                roles: payload.roles,
                permissions: payload.permissions,
            });
            scheduleRefresh(token);
        }
    }, []);  // eslint-disable-line

    // ── Login ─────────────────────────────────────────────────────
    const login = useCallback(async (credentials) => {
        const { data } = await authApi.login(credentials);
        const { accessToken, user } = data.data;

        setAuth(accessToken, user);
        scheduleRefresh(accessToken);

        toast.success(`Welcome back, ${user.fullName.split(' ')[0]}!`);

        // Redirect to role-appropriate home page
        const home = ROLE_HOME[user.roles?.[0]] || ROUTES.DASHBOARD;
        navigate(home, { replace: true });
        return data;
    }, [setAuth, scheduleRefresh, navigate]);

    // ── Logout ────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch { /* ignore — clear locally regardless */ }

        clearTimeout(refreshTimerRef.current);
        clearAuth();
        toast.success('Logged out successfully');
        navigate(ROUTES.LOGIN, { replace: true });
    }, [clearAuth, navigate]);

    // ── Register ──────────────────────────────────────────────────
    const register = useCallback(async (formData) => {
        const { data } = await authApi.register(formData);
        toast.success('Account created! Check your email to verify.');
        navigate(ROUTES.VERIFY_EMAIL + `?email=${formData.email}`);
        return data;
    }, [navigate]);

    // ── Update profile ────────────────────────────────────────────
    const updateProfile = useCallback(async (formData) => {
        const { data } = await authApi.updateMe(formData);
        updateUser(data.data);
        toast.success('Profile updated successfully');
        return data;
    }, [updateUser]);

    const value = {
        login,
        logout,
        register,
        updateProfile,
        scheduleRefresh,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}