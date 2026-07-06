import React from 'react';

const variants = {
    blue: 'bg-blue-100 text-blue-700 ring-blue-600/20',
    green: 'bg-green-100 text-green-700 ring-green-600/20',
    red: 'bg-red-100 text-red-700 ring-red-600/20',
    yellow: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20',
    purple: 'bg-purple-100 text-purple-700 ring-purple-600/20',
    gray: 'bg-gray-100 text-gray-700 ring-gray-600/20',
    indigo: 'bg-indigo-100 text-indigo-700 ring-indigo-600/20',
};

export default function Badge({
    children,
    variant = 'gray',
    dot = false,
    className = '',
}) {
    return (
        <span className={[
            'inline-flex items-center gap-1.5',
            'rounded-full px-2.5 py-0.5',
            'text-xs font-medium ring-1 ring-inset',
            variants[variant],
            className,
        ].join(' ')}>
            {dot && (
                <svg className="w-1.5 h-1.5 fill-current" viewBox="0 0 6 6">
                    <circle cx={3} cy={3} r={3} />
                </svg>
            )}
            {children}
        </span>
    );
}