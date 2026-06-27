"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getQTCalendar, getQTMonthlySummary, getQTWeeklySummary, getUserQTEntries } from "@/services/qt/qtService";
import { filterEntries, getMonthKey, normalizeDateKey } from "@/features/qt/lib/qt-utils";
import type { QTCalendarDay, QTEntry, QTMonthlySummary, QTQueryFilters, QTWeeklySummary } from "@/types/qt";

interface DashboardState {
  entries: QTEntry[];
  calendarDays: QTCalendarDay[];
  monthlySummary: QTMonthlySummary | null;
  weeklySummary: QTWeeklySummary | null;
  loading: boolean;
  reload: () => Promise<void>;
}

export function useQTDashboard(userId: string | undefined, monthDate: Date, filters: QTQueryFilters): DashboardState {
  const [entries, setEntries] = useState<QTEntry[]>([]);
  const [calendarDays, setCalendarDays] = useState<QTCalendarDay[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<QTMonthlySummary | null>(null);
  const [weeklySummary, setWeeklySummary] = useState<QTWeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);

  const monthKey = useMemo(() => getMonthKey(monthDate), [monthDate]);
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth() + 1;

  const reload = useCallback(async () => {
    if (!userId) {
      setEntries([]);
      setCalendarDays([]);
      setMonthlySummary(null);
      setWeeklySummary(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [monthEntries, days, monthSummary, weekSummary] = await Promise.all([
        getUserQTEntries(userId, { ...filters, monthKey }),
        getQTCalendar(userId, year, month),
        getQTMonthlySummary(userId, year, month),
        getQTWeeklySummary(userId, new Date()),
      ]);
      setEntries(monthEntries);
      setCalendarDays(days);
      setMonthlySummary(monthSummary);
      setWeeklySummary(weekSummary);
    } finally {
      setLoading(false);
    }
  }, [filters, month, monthKey, userId, year]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const selectedDateEntries = useMemo(() => {
    if (!filters.dateKey) return entries;
    return filterEntries(entries, { dateKey: normalizeDateKey(filters.dateKey) });
  }, [entries, filters.dateKey]);

  return { entries: selectedDateEntries, calendarDays, monthlySummary, weeklySummary, loading, reload };
}
