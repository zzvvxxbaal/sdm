"use client";

import { cn } from "@/lib/utils";
import { BottomNavigation } from "./BottomNavigation";
import { TopHeader } from "./TopHeader";

interface AppShellProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showNav?: boolean;
}

export function AppShell({ children, showHeader = true, showNav = true }: AppShellProps) {
  return (
    <div className="relative min-h-[100dvh] bg-[#f8fafc] dark:bg-[#0a0a0a]">
      {showHeader && <TopHeader />}
      <main
        className={cn(
          "mx-auto max-w-lg",
          showHeader && "pt-14",
          showNav && "pb-[calc(4rem+max(1rem,env(safe-area-inset-bottom)))]"
        )}
      >
        {children}
      </main>
      {showNav && <BottomNavigation />}
    </div>
  );
}
