"use client";

import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <main
      className={cn(
        "flex min-h-screen flex-col items-center justify-center px-4 py-8",
        "bg-[#f5f5f5] dark:bg-[#0a0a0a]",
        className
      )}
    >
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB] text-white text-lg font-bold shadow-sm">
          S
        </div>
        <h2 className="text-base font-semibold text-[#171717] dark:text-[#f5f5f5]">
          SDM
        </h2>
        <p className="mt-0.5 text-xs text-[#a3a3a3] dark:text-[#737373]">
          서대문교회 청년부
        </p>
      </div>
      {children}
    </main>
  );
}
