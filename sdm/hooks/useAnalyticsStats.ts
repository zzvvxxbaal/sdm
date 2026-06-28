"use client";

import { useEffect, useState } from "react";
import { getAnalyticsStats, type AnalyticsStats } from "@/services/stats";

export function useAnalyticsStats() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const result = await getAnalyticsStats();
        if (active) setStats(result);
      } catch (err) {
        console.error("Failed to load analytics stats:", err);
        if (active) setError("분석 데이터를 불러오지 못했습니다.");
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
