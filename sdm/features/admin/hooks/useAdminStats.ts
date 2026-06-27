"use client";

import { useEffect, useState } from "react";

import { getAdminStats, type AdminStats } from "@/services/stats";

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const result = await getAdminStats();
        if (active) setStats(result);
      } catch {
        if (active) setError("통계를 불러오지 못했습니다.");
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { stats, isLoading, error };
}
