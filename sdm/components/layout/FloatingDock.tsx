"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  Home,
  PenLine,
  User,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ResponsiveContainer } from "./ResponsiveContainer";

interface DockItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const dockItems: DockItem[] = [
  { href: "/", label: "홈", icon: Home },
  { href: "/qt", label: "QT", icon: PenLine },
  { href: "/prayer", label: "기도", icon: BookOpen },
  { href: "/calendar", label: "일정", icon: CalendarDays },
  { href: "/profile", label: "프로필", icon: User },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function FloatingDock() {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
      <ResponsiveContainer
        className="flex justify-center"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)",
        }}
      >
        <nav
          aria-label="주요 탐색"
          className="pointer-events-auto inline-flex w-full max-w-md items-center justify-between gap-1 rounded-full border border-white/50 bg-white/[0.72] p-2 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.35)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/[0.6]"
        >
          {dockItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-w-0 flex-1 items-center justify-center rounded-full px-2 py-2.5 text-[11px] font-medium text-neutral-500 transition-all duration-200",
                  "sm:gap-2 sm:px-3",
                  active
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "hover:bg-white/80 hover:text-neutral-900",
                )}
              >
                <span className="flex items-center justify-center sm:hidden">
                  <Icon className="h-4 w-4" strokeWidth={active ? 2.4 : 2} />
                </span>
                <span className="hidden items-center gap-2 sm:flex">
                  <Icon className="h-4 w-4" strokeWidth={active ? 2.4 : 2} />
                  {item.label}
                </span>
                <span className="sr-only sm:hidden">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </ResponsiveContainer>
    </div>
  );
}
