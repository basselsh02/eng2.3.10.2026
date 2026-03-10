import React from "react";

export default function CardFooter({ children, className = "" }) {
  return (
    <div className={`border-t border-gray-200 px-4 py-3 ${className}`}>
      {children}
    </div>
  );
}
