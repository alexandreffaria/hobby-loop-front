import React from "react";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  isSelect?: boolean; // Optional prop to indicate if this field is a select dropdown
  onClick?: () => void; // Optional click handler for select fields
}

export function FormField({
  label,
  children,
  isSelect = false,
  onClick,
}: FormFieldProps) {
  return (
    <div
      className={`flex flex-col p-4 transition-colors ${onClick ? "cursor-pointer hover:bg-white/10" : ""}`}
      onClick={onClick}
    >
      {/* 1. The Label: Small, muted color to guide the user without distraction */}
      <label className="mb-1 text-xs text-gray-400">{label}</label>

      {/* 2. The Content: The actual input or display value */}
      <div
        className={`text-sm font-medium ${isSelect ? "text-brand-pink" : "text-white"}`}
      >
        {children}
      </div>
    </div>
  );
}
