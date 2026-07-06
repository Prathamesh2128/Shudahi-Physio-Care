import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS, ROLE_HOME } from '../../constants/permissions';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
    {
        group: 'Main',
        items: [
            { label: 'Dashboard', path: '/dashboard', icon: DashIcon, perms: null },
            { label: 'Patients', path: '/patients', icon: PatientsIcon, perms: [PERMISSIONS.PATIENTS_VIEW_ALL] },
            { label: 'Appointments', path: '/appointments', icon: CalIcon, perms: [PERMISSIONS.APPOINTMENTS_READ_ALL, PERMISSIONS.APPOINTMENTS_READ_OWN] },
        ],
    },
    {
        group: 'Clinical',
        items: [
            { label: 'Medical Records', path: '/medical-records', icon: RecordsIcon, perms: [PERMISSIONS.MEDICAL_RECORDS_READ_ALL] },
            { label: 'Laboratory', path: '/lab', icon: LabIcon, perms: [PERMISSIONS.LAB_VIEW_ORDERS, PERMISSIONS.LAB_VIEW_OWN_RESULTS] },
            { label: 'Pharmacy', path: '/pharmacy', icon: RxIcon, perms: [PERMISSIONS.PHARMACY_VIEW_QUEUE, PERMISSIONS.PHARMACY_VIEW_INVENTORY] },
        ],
    },
    {
        group: 'Operations',
        items: [
            { label: 'Ward', path: '/ward', icon: WardIcon, perms: [PERMISSIONS.WARD_VIEW] },
            { label: 'Billing', path: '/billing', icon: BillIcon, perms: [PERMISSIONS.BILLING_VIEW_ALL, PERMISSIONS.BILLING_VIEW_OWN] },
        ],
    },
    {
        group: 'Admin',
        items: [
            { label: 'Users', path: '/admin/users', icon: UsersIcon, perms: [PERMISSIONS.ADMIN_MANAGE_USERS] },
            { label: 'Roles', path: '/admin/roles', icon: ShieldIcon, perms: [PERMISSIONS.ADMIN_MANAGE_ROLES] },
            { label: 'Audit Logs', path: '/admin/audit-logs', icon: LogIcon, perms: [PERMISSIONS.ADMIN_VIEW_AUDIT_LOG] },
        ],
    },
];

export default function Sidebar({ collapsed, onCollapse }) {
    const { canAny } = usePermissions();

    return (
        <aside className={[
            'h-screen bg-gray-900 flex flex-col transition-all duration-300 flex-shrink-0',
            collapsed ? 'w-16' : 'w-64',
        ].join(' ')}>

            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 4v16m-8-8h16" />
                    </svg>
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <p className="font-bold text-white text-sm truncate">HMS Platform</p>
                        <p className="text-gray-500 text-xs truncate">v1.0.0</p>
                    </div>
                )}
                <button
                    onClick={onCollapse}
                    className="ml-auto text-gray-500 hover:text-gray-300 transition-colors"
                >
                    {collapsed
                        ? <ChevronRight className="w-4 h-4" />
                        : <ChevronLeft className="w-4 h-4" />
                    }
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 space-y-6 px-2">
                {NAV_ITEMS.map(group => {
                    const visibleItems = group.items.filter(
                        item => !item.perms || canAny(item.perms)
                    );
                    if (!visibleItems.length) return null;

                    return (
                        <div key={group.group}>
                            {!collapsed && (
                                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider px-3 mb-2">
                                    {group.group}
                                </p>
                            )}
                            <ul className="space-y-0.5">
                                {visibleItems.map(item => (
                                    <SidebarLink
                                        key={item.path}
                                        item={item}
                                        collapsed={collapsed}
                                    />
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </nav>

            {/* User quick actions */}
            <div className="border-t border-gray-800 p-2">
                <NavLink
                    to="/profile"
                    className={({ isActive }) => [
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm',
                        'transition-colors duration-150',
                        isActive
                            ? 'bg-gray-700 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200',
                    ].join(' ')}
                >
                    <ProfileIcon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span>My Profile</span>}
                </NavLink>
            </div>
        </aside>
    );
}

function SidebarLink({ item, collapsed }) {
    return (
        <li>
            <NavLink
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) => [
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm',
                    'transition-colors duration-150',
                    isActive
                        ? 'bg-primary-700 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200',
                ].join(' ')}
            >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
        </li>
    );
}

// SVG Icon components
function DashIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>; }
function PatientsIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>; }
function CalIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>; }
function RecordsIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>; }
function LabIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>; }
function RxIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>; }
function WardIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>; }
function BillIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" /></svg>; }
function UsersIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>; }
function ShieldIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>; }
function LogIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>; }
function ProfileIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>; }
function ChevronLeft(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>; }
function ChevronRight(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>; }