import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

/**
 * Conditionally renders children based on permissions or roles.
 *
 * Usage:
 *   <PermissionGate permission="pharmacy:dispense">
 *     <DispenseButton />
 *   </PermissionGate>
 *
 *   <PermissionGate anyOf={['lab:upload_results','lab:verify_results']}>
 *     <LabPanel />
 *   </PermissionGate>
 *
 *   <PermissionGate role="doctor">
 *     <PrescriptionForm />
 *   </PermissionGate>
 */
export default function PermissionGate({
    children,
    permission,           // single slug
    anyOf,               // array — user needs any one
    allOf,               // array — user needs all
    role,                // single role
    anyRole,             // array of roles
    fallback = null,     // what to render when access denied
}) {
    const { can, canAny, canAll, isRole, isAnyRole } = usePermissions();

    let allowed = true;

    if (permission) allowed = allowed && can(permission);
    if (anyOf) allowed = allowed && canAny(anyOf);
    if (allOf) allowed = allowed && canAll(allOf);
    if (role) allowed = allowed && isRole(role);
    if (anyRole) allowed = allowed && isAnyRole(anyRole);

    return allowed ? children : fallback;
}