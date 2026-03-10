import React from "react";

export default function CardBody({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
