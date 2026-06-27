import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui";

interface AdminNavCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: number;
}

export function AdminNavCard({
  href,
  icon: Icon,
  title,
  description,
  badge,
}: AdminNavCardProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-[#e5e5e5] bg-white p-4 transition-all hover:border-[#2563EB]/40 hover:shadow-md dark:border-[#2c2c2e] dark:bg-[#1c1c1e]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-[#171717] dark:text-[#f5f5f5]">
            {title}
          </span>
          {badge !== undefined && badge > 0 && (
            <Badge color="#EF4444">{badge}</Badge>
          )}
        </div>
        <p className="truncate text-xs text-[#737373] dark:text-[#a3a3a3]">
          {description}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-[#a3a3a3]" />
    </Link>
  );
}
