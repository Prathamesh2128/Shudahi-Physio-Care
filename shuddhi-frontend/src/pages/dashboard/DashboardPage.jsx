import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import { PERMISSIONS } from '../../constants/permissions';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import PermissionGate from '../../components/common/PermissionGate';

const STAT_CARDS = [
    {
        label: 'Total Patients',
        value: '1,284',
        change: '+12 this week',
        positive: true,
        icon: PatIcon,
        color: 'blue',
        perm: PERMISSIONS.PATIENTS_VIEW_ALL,
        href: '/patients',
    },
    {
        label: 'Today\'s Appointments',
        value: '38',
        change: '6 pending',
        positive: null,
        icon: CalIcon,
        color: 'purple',
        perm: PERMISSIONS.APPOINTMENTS_READ_ALL,
        href: '/appointments',
    },
    {
        label: 'Lab Orders',
        value: '17',
        change: '3 critical',
        positive: false,
        icon: LabIcon,
        color: 'red',
        perm: PERMISSIONS.LAB_VIEW_ORDERS,
        href: '/lab',
    },
    {
        label: 'Pending Dispense',
        value: '9',
        change: 'Needs attention',
        positive: false,
        icon: RxIcon,
        color: 'yellow',
        perm: PERMISSIONS.PHARMACY_VIEW_QUEUE,
        href: '/pharmacy',
    },
];

const COLORS = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', ring: 'bg-blue-100' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', ring: 'bg-purple-100' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', ring: 'bg-red-100' },
    yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600', ring: 'bg-yellow-100' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', ring: 'bg-green-100' },
};

export default function DashboardPage() {
    const { user } = useAuth();
    const { can } = usePermissions();
    const visibleCards = STAT_CARDS.filter(c => !c.perm || can(c.perm));

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="space-y-6 animate-fade-in">

            {/* Welcome banner */}
            <div className="bg-gradient-to-r from-primary-700 to-primary-600 rounded-2xl p-6 text-white">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-primary-200 text-sm font-medium">
                            {greeting()},
                        </p>
                        <h1 className="text-2xl font-bold mt-0.5">
                            {user?.fullName || 'Welcome'}
                        </h1>
                        <p className="text-primary-200 text-sm mt-1">
                            {new Date().toLocaleDateString('en-IN', {
                                weekday: 'long', year: 'numeric',
                                month: 'long', day: 'numeric',
                            })}
                        </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {user?.roles?.map(role => (
                            <span
                                key={role}
                                className="text-xs font-medium bg-white/20 text-white px-3 py-1.5 rounded-full capitalize"
                            >
                                {role.replace('_', ' ')}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stat cards */}
            {visibleCards.length > 0 && (
                <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Overview
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {visibleCards.map(card => {
                            const c = COLORS[card.color];
                            return (
                                <Link
                                    to={card.href}
                                    key={card.label}
                                    className="card hover:shadow-md transition-shadow group"
                                >
                                    <div className="card-body">
                                        <div className="flex items-start justify-between">
                                            <div
                                                className={`w-10 h-10 rounded-xl ${c.ring} flex items-center justify-center`}
                                            >
                                                <card.icon className={`w-5 h-5 ${c.icon}`} />
                                            </div>
                                            <span className="text-gray-300 group-hover:text-gray-400 transition-colors">→</span>
                                        </div>
                                        <div className="mt-3">
                                            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                            <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
                                        </div>
                                        <p className={`text-xs font-medium mt-2 ${card.positive === true ? 'text-green-600' :
                                                card.positive === false ? 'text-red-600' : 'text-gray-500'
                                            }`}>
                                            {card.change}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Quick actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* My permissions */}
                <div className="card">
                    <div className="card-header flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-900">
                            My permissions
                        </h3>
                        <Badge variant="blue">
                            {user?.permissions?.length || 0}
                        </Badge>
                    </div>
                    <div className="card-body">
                        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                            {user?.permissions?.map(p => (
                                <span
                                    key={p}
                                    className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                >
                                    {p}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick links */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="text-base font-semibold text-gray-900">
                            Quick actions
                        </h3>
                    </div>
                    <div className="card-body space-y-2">
                        <PermissionGate permission={PERMISSIONS.PATIENTS_CREATE}>
                            <QuickLink href="/patients" icon="➕" label="Register new patient" />
                        </PermissionGate>
                        <PermissionGate anyOf={[PERMISSIONS.APPOINTMENTS_CREATE, PERMISSIONS.APPOINTMENTS_READ_OWN]}>
                            <QuickLink href="/appointments" icon="📅" label="Book appointment" />
                        </PermissionGate>
                        <PermissionGate permission={PERMISSIONS.LAB_ORDER_TEST}>
                            <QuickLink href="/lab" icon="🔬" label="Order lab test" />
                        </PermissionGate>
                        <PermissionGate permission={PERMISSIONS.PHARMACY_DISPENSE}>
                            <QuickLink href="/pharmacy" icon="💊" label="Dispense medicine" />
                        </PermissionGate>
                        <PermissionGate permission={PERMISSIONS.BILLING_CREATE_INVOICE}>
                            <QuickLink href="/billing" icon="💳" label="Create invoice" />
                        </PermissionGate>
                        <QuickLink href="/profile" icon="👤" label="View my profile" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function QuickLink({ href, icon, label }) {
    return (
        <Link
            to={href}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
        >
            <span className="text-lg">{icon}</span>
            <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                {label}
            </span>
            <span className="ml-auto text-gray-300 group-hover:text-gray-500">→</span>
        </Link>
    );
}

function PatIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>; }
function CalIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>; }
function LabIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>; }
function RxIcon(p) { return <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>; }