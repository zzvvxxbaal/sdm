"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, type, label, error, rightElement, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-[#525252] dark:text-[#a3a3a3]">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "h-12 w-full rounded-xl border border-[#e5e5e5] bg-white px-4 text-sm text-[#171717] outline-none transition-all",
              "placeholder:text-[#a3a3a3]",
              "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10",
              "dark:border-[#2c2c2e] dark:bg-[#1c1c1e] dark:text-[#f5f5f5]",
              "dark:focus:border-[#2563EB] dark:focus:ring-[#2563EB]/20",
              error && "border-red-400 focus:border-red-400 focus:ring-red-400/10",
              (isPassword || rightElement) && "pr-12",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a3a3a3] transition-colors hover:text-[#737373] dark:text-[#737373] dark:hover:text-[#a3a3a3]"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
          {rightElement && !isPassword && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs font-medium text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
