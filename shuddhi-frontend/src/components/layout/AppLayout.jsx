import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const PAGE_TITLES = {
    '/dashboard': 'Dashboard',
    '/patients': 'Patients',
    '/appointments': 'Appointments',
    '/medical-records': 'Medical Records',
    '/lab': 'Laboratory',
    '/pharmacy': 'Pharmacy',
    '/ward': 'Ward Management',
    '/billing': 'Billing',
    '/admin/users': 'User Management',
    '/admin/roles': 'Role Management',
    '/admin/audit-logs': 'Audit Logs',
    '/profile': 'My Profile',
    '/profile/change-password': 'Change Password',
    '/profile/sessions': 'Active Sessions',
};

export default function AppLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const title = PAGE_TITLES[location.pathname] || 'HMS Platform';

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar
                collapsed={collapsed}
                onCollapse={() => setCollapsed(v => !v)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar title={title} />

                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}