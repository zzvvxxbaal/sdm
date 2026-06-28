"use client";

import { ReactNode } from "react";
import { useRole } from "@/hooks/useRole";
import { hasAnyRole, UserRole } from "@/types/role";
import { cn } from "@/lib/utils";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
  className?: string;
}

/**
 * Component that guards UI content based on user role.
 * Only renders children if the user has one of the allowed roles.
 * Shows fallback content if user doesn't have access.
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallback = (
    <div className="rounded-2xl border border-[#e5e5e5] bg-[#fafafa] p-6 text-center dark:border-[#404040] dark:bg-[#1a1a1a]">
      <p className="text-sm text-[#737373] dark:text-[#a3a3a3]">
        이 기능에 접근할 권한이 없습니다.
      </p>
    </div>
  ),
  className,
}: RoleGuardProps) {
  const { role, isLoading } = useRole();

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // Check if user has required role
  const hasAccess = role && hasAnyRole(role, allowedRoles);

  return (
    <div className={cn(className)}>
      {hasAccess ? children : fallback}
    </div>
  );
}
