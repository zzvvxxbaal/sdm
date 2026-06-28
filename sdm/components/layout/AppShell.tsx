"use client";

import { cn } from "@/lib/utils";
import { FloatingDock } from "./FloatingDock";
import { ResponsiveContainer } from "./ResponsiveContainer";
import { TopHeader } from "./TopHeader";

interface AppShellProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showNav?: boolean;
}

export function AppShell({ children, showHeader = true, showNav = true }: AppShellProps) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#f6f7f9] text-[#111111]">
      {showHeader && <TopHeader />}
      <main
        className={cn(
          "relative",
          showHeader ? "pt-4" : "pt-6",
          showNav ? "pb-[calc(env(safe-area-inset-bottom)+7rem)]" : "pb-10",
        )}
      >
        <ResponsiveContainer className="max-w-5xl">{children}</ResponsiveContainer>
      </main>
      {showNav && <FloatingDock />}
    </div>
  );
}
