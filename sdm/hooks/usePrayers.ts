"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  getPrayers,
  getUserPrayers,
  createPrayer,
  markAsAnswered,
  markAsUnanswered,
  deletePrayer,
  incrementPrayerCount,
} from "@/services/prayer/prayerService";
import type { PrayerRequestModel } from "@/models/prayer_request";

interface UsePrayersResult {
  prayers: (PrayerRequestModel & { id: string })[];
  userPrayers: (PrayerRequestModel & { id: string })[];
  loading: boolean;
  error: Error | null;
  createPrayer: (data: Omit<PrayerRequestModel, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">) => Promise<string>;
  markAsAnswered: (prayerId: string) => Promise<void>;
  markAsUnanswered: (prayerId: string) => Promise<void>;
  deletePrayer: (prayerId: string) => Promise<void>;
  incrementPrayerCount: (prayerId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Hook to manage prayer requests with real-time state
 */
export function usePrayers(): UsePrayersResult {
  const { user } = useAuth();
  const [prayers, setPrayers] = useState<(PrayerRequestModel & { id: string })[]>([]);
  const [userPrayers, setUserPrayers] = useState<(PrayerRequestModel & { id: string })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPrayers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const allPrayers = await getPrayers({ limit: 100 });
      setPrayers(allPrayers);

      if (user?.uid) {
        const userSpecificPrayers = await getUserPrayers(user.uid, { limit: 100 });
        setUserPrayers(userSpecificPrayers);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error("Failed to fetch prayers:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    void fetchPrayers();
  }, [fetchPrayers]);

  const createPrayerRecord = useCallback(
    async (data: Omit<PrayerRequestModel, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">): Promise<string> => {
      if (!user?.uid) throw new Error("User not authenticated");

      try {
        const id = await createPrayer(user.uid, data);
        await fetchPrayers();
        return id;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [user?.uid, fetchPrayers]
  );

  const markAnswered = useCallback(
    async (prayerId: string): Promise<void> => {
      if (!user?.uid) throw new Error("User not authenticated");

      try {
        await markAsAnswered(prayerId, user.uid);
        await fetchPrayers();
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [user?.uid, fetchPrayers]
  );

  const markUnanswered = useCallback(
    async (prayerId: string): Promise<void> => {
      if (!user?.uid) throw new Error("User not authenticated");

      try {
        await markAsUnanswered(prayerId, user.uid);
        await fetchPrayers();
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [user?.uid, fetchPrayers]
  );

  const deletePrayerRecord = useCallback(
    async (prayerId: string): Promise<void> => {
      if (!user?.uid) throw new Error("User not authenticated");

      try {
        await deletePrayer(prayerId, user.uid);
        await fetchPrayers();
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [user?.uid, fetchPrayers]
  );

  const incrementPrayerCountFn = useCallback(
    async (prayerId: string): Promise<void> => {
      try {
        await incrementPrayerCount(prayerId);
        await fetchPrayers();
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [fetchPrayers]
  );

  return {
    prayers,
    userPrayers,
    loading,
    error,
    createPrayer: createPrayerRecord,
    markAsAnswered: markAnswered,
    markAsUnanswered: markUnanswered,
    deletePrayer: deletePrayerRecord,
    incrementPrayerCount: incrementPrayerCountFn,
    refetch: fetchPrayers,
  };
}
