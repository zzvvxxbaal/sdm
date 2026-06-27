"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { hasAnyRole } from "@/features/auth/utils/roles";

export function withRole<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles: string[]
): React.FC<P> {
  return function WithRole(props: P) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    const hasAccess = user ? hasAnyRole(user.role, requiredRoles) : false;

    useEffect(() => {
      if (!isLoading && (!user || !hasAccess)) {
        router.replace("/");
      }
    }, [isLoading, user, hasAccess, router]);

    if (isLoading) {
      return null;
    }

    if (!hasAccess) {
      return null;
    }

    return <Component {...props} />;
  };
}
