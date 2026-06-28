"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  getUserQTEntries,
  getQTEntryByDate,
  createQTEntry,
  deleteQTEntry,
  updateQTEntry,
} from "@/services/qt/qtService";
import type { QTEntry, QTEntryInput } from "@/types/qt";

interface UseQTResult {
  entries: QTEntry[];
  todayQT: QTEntry | null;
  loading: boolean;
  error: Error | null;
  createQT: (data: QTEntryInput) => Promise<string>;
  deleteQT: (id: string) => Promise<void>;
  updateQT: (id: string, data: Partial<QTEntryInput>) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Hook to manage user's QT entries with real-time updates
 */
export function useQT(): UseQTResult {
  const { user } = useAuth();
  const [entries, setEntries] = useState<QTEntry[]>([]);
  const [todayQT, setTodayQT] = useState<QTEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const fetchEntries = useCallback(async () => {
    if (!user?.uid) {
      setEntries([]);
      setTodayQT(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [allEntries, todayEntry] = await Promise.all([
        getUserQTEntries(user.uid, { limit: 100 }),
        getQTEntryByDate(user.uid, today),
      ]);

      setEntries(allEntries);
      setTodayQT(todayEntry);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error("Failed to fetch QT entries:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, today]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    void fetchEntries();
  }, [fetchEntries]);

  const createQT = useCallback(
    async (data: QTEntryInput): Promise<string> => {
      if (!user?.uid) throw new Error("User not authenticated");

      try {
        const id = await createQTEntry(user.uid, data);
        await fetchEntries();
        return id;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [user?.uid, fetchEntries]
  );

  const deleteQT = useCallback(
    async (id: string): Promise<void> => {
      try {
        await deleteQTEntry(id);
        await fetchEntries();
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [fetchEntries]
  );

  const updateQT = useCallback(
    async (id: string, data: Partial<QTEntryInput>): Promise<void> => {
      try {
        await updateQTEntry(id, data);
        await fetchEntries();
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [fetchEntries]
  );

  return {
    entries,
    todayQT,
    loading,
    error,
    createQT,
    deleteQT,
    updateQT,
    refetch: fetchEntries,
  };
}
