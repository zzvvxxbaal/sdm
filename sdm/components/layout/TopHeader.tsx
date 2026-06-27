"use client";

import { cn } from "@/lib/utils";
import { Church } from "lucide-react";

export function TopHeader() {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-14",
        "border-b border-[#e5e5e5] bg-white/90 backdrop-blur-md",
        "dark:border-[#2c2c2e] dark:bg-[#0a0a0a]/90"
      )}
    >
      <div className="mx-auto flex h-full max-w-lg items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB] text-white">
            <Church className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#171717] dark:text-[#f5f5f5]">
              SDM
            </h1>
            <p className="text-[10px] text-[#a3a3a3] -mt-0.5">서대문교회 청년부</p>
          </div>
        </div>
      </div>
    </header>
  );
}
