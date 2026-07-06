import React from 'react';

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
            {/* Decorative blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/3 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md animate-slide-up">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl mb-4">
                        <HmsLogo />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Hospital Management
                    </h1>
                    <p className="text-primary-200 text-sm mt-1">
                        Integrated Healthcare Platform
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {children}
                </div>

                {/* Footer */}
                <p className="text-center text-primary-300 text-xs mt-6">
                    © {new Date().getFullYear()} HMS · All rights reserved · v1.0.0
                </p>
            </div>
        </div>
    );
}

function HmsLogo() {
    return (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
            <rect width={32} height={32} rx={8} fill="#4f46e5" />
            <path
                d="M8 16h4m4-8v16m4-16v16m-4-8h8"
                stroke="white"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}