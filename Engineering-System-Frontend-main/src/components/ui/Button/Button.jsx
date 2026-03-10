import React from "react";
import clsx from "clsx";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  icon = null,
  className = "",
  type = "button",
  iconPosition = "start",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium focus:outline-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-offset-0";

  const variants = {
    primary:
      "bg-primary-500 text-primary-content-500 hover:bg-primary-600 hover:text-primary-content-600 focus:ring-primary-500",
    secondary:
      "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400",
    outline: "border border-gray-400 hover:opacity-70 focus:ring-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    warning:
      "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
    info: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    light: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300",
    dark: "bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-700",
  };

  const sizes = {
    icon: "p-2",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-8 py-2 text-sm",
  };

  const isDisabled = disabled || loading;
  const disabledStyles = isDisabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        disabledStyles,
        className,
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <span className="animate-spin ml-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
      {icon && iconPosition === "start" && !loading && <span className="ml-2">{icon}</span>}
      {children}
      {icon && iconPosition === "end" && !loading && <span className="ms-2">{icon}</span>}
    </button>
  );
}
