"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const baseControl = cn(
  "w-full rounded-xl border border-[#e5e5e5] bg-white px-4 text-sm text-[#171717] outline-none transition-all",
  "placeholder:text-[#a3a3a3]",
  "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10",
  "dark:border-[#2c2c2e] dark:bg-[#1c1c1e] dark:text-[#f5f5f5]",
  "dark:focus:border-[#2563EB] dark:focus:ring-[#2563EB]/20"
);

const errorControl =
  "border-red-400 focus:border-red-400 focus:ring-red-400/10";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function Field({
  label,
  error,
  hint,
  required,
  children,
}: FieldWrapperProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-[#525252] dark:text-[#a3a3a3]">
          {label}
          {required && <span className="ml-0.5 text-[#EF4444]">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs text-[#a3a3a3]">{hint}</p>
      )}
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(baseControl, "h-12", hasError && errorControl, className)}
      {...props}
    />
  )
);
Input.displayName = "Input";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, hasError, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        baseControl,
        "h-12 appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10",
        hasError && errorControl,
        className
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a3a3a3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
      }}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(baseControl, "py-3", hasError && errorControl, className)}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
