import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import useAuthStore from '../store/authStore';

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside <AuthProvider>');
    }

    const {
        user, isAuthenticated, isLoading,
        accessToken, hasPermission, hasRole,
        getPermissions, getRoles,
    } = useAuthStore();

    return {
        ...context,
        user,
        isAuthenticated,
        isLoading,
        accessToken,
        hasPermission,
        hasRole,
        permissions: getPermissions(),
        roles: getRoles(),
    };
}