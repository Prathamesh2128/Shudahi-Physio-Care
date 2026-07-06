import React from "react";
import Spinner from "./Spinner";

const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-sm focus:ring-primary-500",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm focus:ring-primary-500",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500",
    ghost: "text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
    success: "bg-brand-600 hover:bg-brand-700 text-white shadow-sm focus:ring-brand-500",
};

const sizes = {
    xs: "px-2.5 py-1.5 text-xs rounded-md",
    sm: "px-3.5 py-2 text-sm rounded-lg",
    md: "px-4 py-2.5 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-xl",
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    icon,
    iconRight,
    fullWidth = false,
    className = "",
    type = "button",
    onClick,
    ...rest
}) {
    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={[
                "inline-flex items-center justify-center gap-2",
                "font-medium transition-all duration-150",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                fullWidth ? "w-full" : "",
                className,
            ].join(" ")}
            {...rest}
        >
            {loading ? (
                <Spinner size="sm" color={variant === "secondary" ? "gray" : "white"} />
            ) : (
                icon && <span className="w-4 h-4 flex-shrink-0">{icon}</span>
            )}
            {children}
            {!loading && iconRight && (
                <span className="w-4 h-4 flex-shrink-0">{iconRight}</span>
            )}
        </button>
    );
}
