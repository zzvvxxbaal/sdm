"use client";

import { useEffect, useState } from "react";

import { createScheduleEvent, deleteScheduleEvent, getMonthlyScheduleEvents, getWeeklyScheduleEvents, updateScheduleEvent, type ScheduleEventInput } from "@/services/schedule";
import type { EventModel } from "@/models/event";

export function useScheduleBoard(monthAnchorDate: Date, weekAnchorDate: Date) {
  const [monthlyEvents, setMonthlyEvents] = useState<EventModel[]>([]);
  const [weeklyEvents, setWeeklyEvents] = useState<EventModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const [month, week] = await Promise.all([
        getMonthlyScheduleEvents(monthAnchorDate),
        getWeeklyScheduleEvents(weekAnchorDate),
      ]);
      setMonthlyEvents(month);
      setWeeklyEvents(week);
    } catch {
      setError("일정을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const [month, week] = await Promise.all([
          getMonthlyScheduleEvents(monthAnchorDate),
          getWeeklyScheduleEvents(weekAnchorDate),
        ]);
        if (!active) return;
        setMonthlyEvents(month);
        setWeeklyEvents(week);
      } catch {
        if (active) setError("일정을 불러오지 못했습니다.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [monthAnchorDate, weekAnchorDate]);

  const saveEvent = async (input: ScheduleEventInput, userId: string, id?: string) => {
    if (id) await updateScheduleEvent(id, input, userId);
    else await createScheduleEvent(input, userId);
    await reload();
  };

  const removeEvent = async (id: string) => {
    await deleteScheduleEvent(id);
    await reload();
  };

  return { monthlyEvents, weeklyEvents, loading, error, saveEvent, removeEvent, reload };
}
