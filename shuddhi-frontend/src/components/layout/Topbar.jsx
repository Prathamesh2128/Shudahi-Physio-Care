import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Badge from '../common/Badge';

export default function Topbar({ title }) {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handler = e => {
            if (menuRef.current && !menuRef.current.contains(e.target))
                setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const initials = user?.fullName
        ?.split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'U';

    const roleColors = {
        doctor: 'green',
        nurse: 'blue',
        receptionist: 'yellow',
        lab_technician: 'purple',
        pharmacist: 'indigo',
        accountant: 'gray',
        admin: 'red',
        super_admin: 'red',
        patient: 'blue',
    };

    const primaryRole = user?.roles?.[0] || 'user';
    const badgeVariant = roleColors[primaryRole] || 'gray';

    return (
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between flex-shrink-0">
            {/* Page title */}
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Notification bell */}
                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <BellIcon className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>

                {/* Profile dropdown */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setOpen(v => !v)}
                        className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                            {initials}
                        </div>

                        <div className="text-left hidden sm:block">
                            <p className="text-sm font-medium text-gray-900 leading-none">
                                {user?.fullName}
                            </p>
                            <Badge variant={badgeVariant} className="mt-1 capitalize">
                                {primaryRole.replace('_', ' ')}
                            </Badge>
                        </div>

                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {/* Dropdown menu */}
                    {open && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 animate-fade-in">
                            {/* User info */}
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.fullName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user?.email}
                                </p>
                            </div>

                            <DropItem href="/profile" label="My Profile" Icon={UserIcon} />
                            <DropItem href="/profile/change-password" label="Change Password" Icon={LockIcon} />
                            <DropItem href="/profile/sessions" label="Active Sessions" Icon={DeviceIcon} />

                            <div className="border-t border-gray-100 mt-1 pt-1">
                                <button
                                    onClick={() => { setOpen(false); logout(); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogoutIcon className="w-4 h-4" />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

function DropItem({ href, label, Icon }) {
    return (
        <Link
            to={href}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
            <Icon className="w-4 h-4 text-gray-400" />
            {label}
        </Link>
    );
}

function BellIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>; }
function ChevronDown(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>; }
function UserIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>; }
function LockIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>; }
function DeviceIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>; }
function LogoutIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>; }