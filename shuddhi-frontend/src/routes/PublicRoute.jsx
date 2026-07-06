import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { ROLE_HOME } from '../constants/permissions';

// Redirects authenticated users away from login/register pages
export default function PublicRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuthStore();
    const user = useAuthStore(s => s.user);

    if (isLoading) return null;

    if (isAuthenticated) {
        const home = ROLE_HOME[user?.roles?.[0]] || '/dashboard';
        return <Navigate to={home} replace />;
    }

    return children;
}