import React from "react";

export default function CardHeader({ children, className = "" }) {
  return (
    <div
      className={`border-b border-primary-500 px-4 py-3 font-medium ${className}`}
    >
      {children}
    </div>
  );
}
