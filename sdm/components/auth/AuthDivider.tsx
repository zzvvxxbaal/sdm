"use client";

import { cn } from "@/lib/utils";

interface AuthDividerProps {
  text?: string;
  className?: string;
}

export function AuthDivider({ text = "또는", className }: AuthDividerProps) {
  return (
    <div className={cn("my-6 flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-[#e5e5e5] dark:bg-[#2c2c2e]" />
      <span className="text-xs font-medium text-[#a3a3a3] dark:text-[#737373]">{text}</span>
      <span className="h-px flex-1 bg-[#e5e5e5] dark:bg-[#2c2c2e]" />
    </div>
  );
}
