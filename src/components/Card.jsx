import React from "react";

// Card wrapper
export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white shadow-md rounded-xl border p-4 ${className}`}>
      {children}
    </div>
  );
}

// Card Header
export function CardHeader({ children, className = "" }) {
  return <div className={`mb-3 ${className}`}>{children}</div>;
}

// Card Title
export function CardTitle({ children, className = "" }) {
  return (
    <h2 className={`text-lg font-semibold text-gray-800 ${className}`}>
      {children}
    </h2>
  );
}

// Card Content
export function CardContent({ children, className = "" }) {
  return <div className={`text-gray-600 ${className}`}>{children}</div>;
}

