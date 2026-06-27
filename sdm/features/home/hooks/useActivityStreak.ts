"use client";

import { useEffect, useState } from "react";

import { getUserQTEntriesWithLimit } from "@/services/qt/qtService";
import type { QTEntry } from "@/types/qt";

const LOOKBACK_LIMIT = 90;

function toKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function dayKey(value: unknown): string | null {
  if (typeof value === "string" && value.length >= 10) return value.slice(0, 10);
  if (value && typeof value === "object") {
    const obj = value as { toDate?: () => Date; seconds?: number };
    if (typeof obj.toDate === "function") return toKey(obj.toDate());
    if (typeof obj.seconds === "number") return toKey(new Date(obj.seconds * 1000));
  }
  return null;
}

function entryKey(entry: QTEntry): string | null {
  const withDate = entry as unknown as { date?: unknown };
  return dayKey(withDate.date) ?? dayKey(entry.createdAt);
}

/** Count consecutive days (ending today or yesterday) that have a QT entry. */
export function computeStreak(keys: string[], today: Date): number {
  const set = new Set(keys);
  const cursor = new Date(today);
  cursor.setHours(0, 0, 0, 0);
  if (!set.has(toKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while (set.has(toKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function useActivityStreak(userId: string | undefined): {
  streak: number;
  loading: boolean;
} {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setStreak(0);
      setLoading(false);
      return;
    }
    let active = true;
    void (async () => {
      setLoading(true);
      try {
        const entries = await getUserQTEntriesWithLimit(userId, {
          limit: LOOKBACK_LIMIT,
        });
        const keys = entries
          .map(entryKey)
          .filter((key): key is string => key !== null);
        if (active) setStreak(computeStreak(keys, new Date()));
      } catch {
        if (active) setStreak(0);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [userId]);

  return { streak, loading };
}
