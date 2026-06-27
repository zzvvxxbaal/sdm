"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/features/auth";
import { getDailyContent, setTodaysVerse, setTodaysQt } from "@/services/daily";
import type { TodaysVerse, TodaysQtPassage } from "@/models/daily_content";

export function useDailyContent() {
  const { user } = useAuth();
  const [verse, setVerse] = useState<TodaysVerse | null>(null);
  const [qt, setQt] = useState<TodaysQtPassage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const content = await getDailyContent();
      setVerse(content?.todaysVerse ?? null);
      setQt(content?.todaysQt ?? null);
    } catch {
      setError("오늘의 콘텐츠를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const saveVerse = useCallback(
    async (value: TodaysVerse) => {
      if (!user) return;
      await setTodaysVerse(value, user.uid);
      await load();
    },
    [user, load],
  );

  const saveQt = useCallback(
    async (value: TodaysQtPassage) => {
      if (!user) return;
      await setTodaysQt(value, user.uid);
      await load();
    },
    [user, load],
  );

  return { verse, qt, isLoading, error, saveVerse, saveQt };
}
