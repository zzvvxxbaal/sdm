"use client";

import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[420px] rounded-2xl bg-white px-6 py-8 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] sm:px-8 sm:py-10",
        "dark:bg-[#1c1c1e] dark:shadow-[0_2px_20px_-4px_rgba(0,0,0,0.3)]",
        "border border-transparent dark:border-[#2c2c2e]",
        className
      )}
    >
      {children}
    </div>
  );
}
