"use client";

import { cn } from "@/lib/utils";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function AuthHeader({ title, subtitle, className }: AuthHeaderProps) {
  return (
    <div className={cn("mb-8 text-center", className)}>
      <h1 className="text-2xl font-semibold tracking-tight text-[#171717] dark:text-[#f5f5f5] sm:text-[28px]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm text-[#a3a3a3] dark:text-[#737373]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
