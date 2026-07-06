import React, { forwardRef, useState } from 'react';

const Input = forwardRef(function Input(
    {
        label,
        error,
        hint,
        icon,
        iconRight,
        type = 'text',
        size = 'md',
        required = false,
        className = '',
        ...rest
    },
    ref
) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-3.5 py-2.5 text-sm',
        lg: 'px-4 py-3 text-base',
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="form-label">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {/* Left icon */}
                {icon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        {icon}
                    </span>
                )}

                <input
                    ref={ref}
                    type={inputType}
                    className={[
                        'block w-full rounded-lg border',
                        'text-gray-900 placeholder:text-gray-400',
                        'transition duration-150',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                        'disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500',
                        error
                            ? 'border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400'
                            : 'border-gray-300 bg-white hover:border-gray-400',
                        icon ? 'pl-10' : '',
                        iconRight || isPassword ? 'pr-10' : '',
                        sizes[size],
                    ].join(' ')}
                    {...rest}
                />

                {/* Password toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                    >
                        {showPassword
                            ? <EyeOffIcon />
                            : <EyeIcon />
                        }
                    </button>
                )}

                {/* Right icon */}
                {iconRight && !isPassword && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {iconRight}
                    </span>
                )}
            </div>

            {error && (
                <p className="form-error">
                    <ErrorIcon />
                    {error}
                </p>
            )}

            {hint && !error && (
                <p className="text-xs text-gray-500 mt-1">{hint}</p>
            )}
        </div>
    );
});

export default Input;

// Inline SVG icons to avoid extra dependencies
function EyeIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    );
}

function ErrorIcon() {
    return (
        <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd" />
        </svg>
    );
}