import React from 'react';

const colors = {
    white: 'border-white border-t-transparent',
    primary: 'border-primary-600 border-t-transparent',
    gray: 'border-gray-400 border-t-transparent',
};

const sizes = {
    xs: 'w-3 h-3 border',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-2',
    xl: 'w-12 h-12 border-4',
};

export default function Spinner({
    size = 'md',
    color = 'primary',
    className = '',
}) {
    return (
        <span
            role="status"
            aria-label="Loading"
            className={[
                'inline-block rounded-full animate-spin',
                sizes[size],
                colors[color],
                className,
            ].join(' ')}
        />
    );
}