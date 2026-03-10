import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-lg border border-base bg-background shadow-sm p-2 ${className}`}
    >
      {children}
    </div>
  );
}
