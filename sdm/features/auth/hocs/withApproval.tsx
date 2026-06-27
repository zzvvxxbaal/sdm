"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { resolveAuthDestination } from "@/features/auth/utils/redirect";
import { ROUTES } from "@/constants/routes";
import { FullScreenSpinner } from "@/components/ui";

/**
 * Guards a route so only fully onboarded & approved members can access it. Users
 * who still have onboarding steps pending are routed to the correct step.
 */
export function withApproval<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function WithApproval(props: P) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    const destination = user ? resolveAuthDestination(user) : null;

    useEffect(() => {
      if (isLoading) return;
      if (!isAuthenticated || !user) {
        router.replace(ROUTES.LOGIN);
        return;
      }
      if (destination) {
        router.replace(destination);
      }
    }, [isLoading, isAuthenticated, user, destination, router]);

    if (isLoading) {
      return <FullScreenSpinner />;
    }

    if (!isAuthenticated || !user || destination) {
      return <FullScreenSpinner />;
    }

    return <Component {...props} />;
  };
}
