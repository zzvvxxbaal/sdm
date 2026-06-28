"use client";

import { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { COLLECTIONS } from "@/constants/collections";
import { UserRole } from "@/types/role";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface UseRoleResult {
  role: UserRole | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to get the current user's role with real-time updates.
 * Subscribes to Firestore user document and updates when role changes.
 */
export function useRole(): UseRoleResult {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If no user, return early and let initial state handle it
    if (!user?.uid) {
      return;
    }

    // Subscribe to user document for real-time role updates
    const userDocRef = doc(db, COLLECTIONS.USERS, user.uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setRole((data?.role as UserRole) || UserRole.USER);
        } else {
          // Document doesn't exist, default to user role
          setRole(UserRole.USER);
        }
        setIsLoading(false);
      },
      (err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  return { role, isLoading, error };
}
