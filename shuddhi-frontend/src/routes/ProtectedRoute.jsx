import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Spinner from '../components/common/Spinner';
import { usePermissions } from '../hooks/usePermissions';

export default function ProtectedRoute({
    children,
    permission,   // optional — slug required
    anyOf,        // optional — any of these slugs
    role,         // optional — role required
    redirectTo = '/login',
}) {
    const { isAuthenticated, isLoading } = useAuthStore();
    const { can, canAny, isRole } = usePermissions();
    const location = useLocation();

    // Still hydrating from storage
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Spinner size="xl" />
                    <p className="text-gray-500 text-sm mt-4">Loading HMS...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated) {
        return (
            <Navigate
                to={redirectTo}
                state={{ from: location }}
                replace
            />
        );
    }

    // Authenticated but missing required permission
    if (permission && !can(permission)) {
        return <AccessDenied />;
    }

    if (anyOf && !canAny(anyOf)) {
        return <AccessDenied />;
    }

    if (role && !isRole(role)) {
        return <AccessDenied />;
    }

    return children;
}

function AccessDenied() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
                <p className="text-gray-500 text-sm">
                    You do not have the required permissions to access this page.
                    Contact your administrator if you believe this is an error.
                </p>
            </div>
        </div>
    );
}