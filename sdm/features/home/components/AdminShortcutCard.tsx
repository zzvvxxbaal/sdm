"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth";
import { hasAnyRole } from "@/features/auth/utils/roles";
import { ADMIN_ACCESS_ROLES } from "@/types/role";
import { BarChart3 } from "lucide-react";

/**
 * Admin Shortcut Card - shown only to admin users
 * Provides quick access to analytics dashboard
 */
export function AdminShortcutCard() {
  const { user } = useAuth();

  if (!user || !hasAnyRole(user.role, ADMIN_ACCESS_ROLES)) {
    return null;
  }

  return (
    <Link
      href="/admin/analytics"
      className="flex items-center justify-between gap-3 rounded-xl border border-[#e5e5e5] bg-gradient-to-r from-[#2563EB]/5 to-transparent p-4 transition-colors hover:bg-[#2563EB]/10 dark:border-[#2c2c2e] dark:bg-gradient-to-r dark:from-[#2563EB]/10 dark:to-transparent"
    >
      <div>
        <p className="text-xs font-medium text-[#2563EB] dark:text-[#60a5fa]">관리자</p>
        <p className="font-semibold text-[#171717] dark:text-[#f5f5f5]">분석 대시보드</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
        <BarChart3 className="h-5 w-5" />
      </div>
    </Link>
  );
}
