"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/features/auth";
import {
  getOrganizationSettings,
  updateCellLabel,
  initializeOrganizationSettings,
} from "@/services/organization";

interface CellLabel {
  singular: string;
  plural: string;
}

const DEFAULT_LABEL: CellLabel = { singular: "순", plural: "순들" };

export function useSettings() {
  const { user } = useAuth();
  const [cellLabel, setCellLabel] = useState<CellLabel>(DEFAULT_LABEL);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const settings = await getOrganizationSettings();
      if (settings) setCellLabel(settings.cellLabel);
    } catch {
      setError("설정을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const settings = await getOrganizationSettings();
        if (active && settings) setCellLabel(settings.cellLabel);
      } catch {
        if (active) setError("설정을 불러오지 못했습니다.");
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const saveCellLabel = useCallback(
    async (singular: string, plural: string) => {
      await initializeOrganizationSettings();
      await updateCellLabel(singular, plural, user?.uid);
      await load();
    },
    [user, load],
  );

  return { cellLabel, isLoading, error, saveCellLabel };
}
