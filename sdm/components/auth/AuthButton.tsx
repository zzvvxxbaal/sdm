"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "outline" | "ghost";
}

export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ className, isLoading, variant = "primary", children, disabled, ...props }, ref) => {
    const variants = {
      primary: cn(
        "bg-[#2563EB] text-white",
        "hover:bg-[#1d4ed8]",
        "dark:bg-[#2563EB] dark:hover:bg-[#1d4ed8]"
      ),
      outline: cn(
        "border border-[#e5e5e5] bg-white text-[#171717]",
        "hover:bg-[#fafafa] hover:border-[#d4d4d4]",
        "dark:border-[#2c2c2e] dark:bg-[#1c1c1e] dark:text-[#f5f5f5] dark:hover:bg-[#262626]"
      ),
      ghost: cn(
        "bg-transparent text-[#525252]",
        "hover:bg-[#f5f5f5] hover:text-[#171717]",
        "dark:text-[#a3a3a3] dark:hover:bg-[#262626] dark:hover:text-[#f5f5f5]"
      ),
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "flex h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all",
          "disabled:cursor-not-allowed disabled:opacity-60",
          variants[variant],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

AuthButton.displayName = "AuthButton";
