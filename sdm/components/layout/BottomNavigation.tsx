"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  PenLine,
  User,
  Settings,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: "성경", href: "/bible", icon: BookOpen },
  { label: "QT", href: "/qt", icon: PenLine },
  { label: "회원", href: "/profile", icon: User },
  { label: "설정", href: "/settings", icon: Settings },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 h-16",
        "border-t border-[#e5e5e5] bg-white/90 backdrop-blur-md",
        "dark:border-[#2c2c2e] dark:bg-[#0a0a0a]/90"
      )}
    >
      <div className="mx-auto flex h-full max-w-lg items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1.5 transition-colors",
                isActive
                  ? "text-[#2563EB]"
                  : "text-[#a3a3a3] hover:text-[#525252] dark:text-[#737373]"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
