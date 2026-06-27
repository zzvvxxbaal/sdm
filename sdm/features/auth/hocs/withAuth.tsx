"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/hooks/useAuth";

export function withAuth<P extends object>(Component: React.ComponentType<P>): React.FC<P> {
  return function WithAuth(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.replace("/login");
      }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
      return null;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
