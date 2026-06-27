"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useAuth } from "@/features/auth";
import { hasAnyRole } from "@/features/auth/utils/roles";
import { ADMIN_ACCESS_ROLES } from "@/types/role";
import { FullScreenSpinner } from "@/components/ui";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const hasAccess = user ? hasAnyRole(user.role, ADMIN_ACCESS_ROLES) : false;

  useEffect(() => {
    if (!isLoading && !hasAccess) router.replace("/");
  }, [isLoading, hasAccess, router]);

  if (isLoading) return <FullScreenSpinner />;
  if (!hasAccess) return null;

  const isHome = pathname === "/admin";

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
      {!isHome && (
        <div className="sticky top-0 z-30 border-b border-[#e5e5e5] bg-white/80 backdrop-blur dark:border-[#2c2c2e] dark:bg-[#1c1c1e]/80">
          <div className="mx-auto flex max-w-2xl items-center px-4 py-3">
            <Link
              href="/admin"
              className="flex items-center gap-1 text-sm font-semibold text-[#525252] transition-colors hover:text-[#2563EB] dark:text-[#a3a3a3]"
            >
              <ArrowLeft className="h-4 w-4" /> 관리자 홈
            </Link>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
