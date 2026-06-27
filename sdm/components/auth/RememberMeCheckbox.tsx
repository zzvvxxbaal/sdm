"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface RememberMeCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const RememberMeCheckbox = forwardRef<HTMLInputElement, RememberMeCheckboxProps>(
  ({ className, label = "아이디 저장", ...props }, ref) => {
    return (
      <label className={cn("flex cursor-pointer items-center gap-2", className)}>
        <input
          ref={ref}
          type="checkbox"
          className="h-4 w-4 rounded-md border-[#d4d4d4] text-[#2563EB] accent-[#2563EB] transition-colors focus:ring-[#2563EB] dark:border-[#525252] dark:bg-[#262626]"
          {...props}
        />
        <span className="text-sm text-[#525252] dark:text-[#a3a3a3]">{label}</span>
      </label>
    );
  }
);

RememberMeCheckbox.displayName = "RememberMeCheckbox";
