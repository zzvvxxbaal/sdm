"use client";

import { cn } from "@/lib/utils";
import { Bell, Church, CircleUserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { ResponsiveContainer } from "./ResponsiveContainer";

export function TopHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-200",
        scrolled
          ? "border-black/[0.08] bg-white/[0.88] shadow-[0_8px_28px_-24px_rgba(15,23,42,0.45)] backdrop-blur-xl"
          : "border-transparent bg-white/[0.72] backdrop-blur-md",
      )}
      style={{
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <ResponsiveContainer className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-[0_8px_20px_-16px_rgba(15,23,42,0.7)]">
            <Church className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-[0.18em] text-neutral-900">SDM</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="알림"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white/[0.75] text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <Bell className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="프로필"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white/[0.75] text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <CircleUserRound className="h-4 w-4" />
          </button>
        </div>
      </ResponsiveContainer>
    </header>
  );
}
