"use client";

import { startOfMonthDate, toDateSafe } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { EventModel } from "@/models/event";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function buildCalendarCells(anchorDate: Date) {
  const start = startOfMonthDate(anchorDate);
  const startDay = start.getDay();
  const cursor = new Date(start);
  cursor.setDate(cursor.getDate() - startDay);

  return Array.from({ length: 42 }, () => {
    const current = new Date(cursor);
    cursor.setDate(cursor.getDate() + 1);
    return current;
  });
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

interface MonthlyCalendarProps {
  anchorDate: Date;
  selectedDate: Date;
  events: EventModel[];
  onSelectDate: (date: Date) => void;
}

export function MonthlyCalendar({ anchorDate, selectedDate, events, onSelectDate }: MonthlyCalendarProps) {
  const currentMonth = anchorDate.getMonth();
  const selectedKey = dateKey(selectedDate);
  const eventMap = new Map<string, EventModel[]>();

  events.forEach((event) => {
    const key = dateKey(toDateSafe(event.startDate) ?? new Date(event.startDate));
    eventMap.set(key, [...(eventMap.get(key) ?? []), event]);
  });

  return (
    <div className="overflow-hidden rounded-3xl border border-[#e5e5e5] bg-white dark:border-[#2c2c2e] dark:bg-[#1c1c1e]">
      <div className="grid grid-cols-7 border-b border-[#f0f0f0] text-center text-xs font-semibold text-[#737373] dark:border-[#2c2c2e] dark:text-[#a3a3a3]">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-3">{label}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {buildCalendarCells(anchorDate).map((cellDate) => {
          const key = dateKey(cellDate);
          const cellEvents = eventMap.get(key) ?? [];
          const isSelected = key === selectedKey;
          const isOutside = cellDate.getMonth() !== currentMonth;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDate(cellDate)}
              className={cn(
                "flex min-h-20 flex-col items-start gap-2 border-b border-r border-[#f5f5f5] px-2 py-2 text-left transition-colors last:border-r-0 dark:border-[#262626]",
                isSelected && "bg-[#2563EB]/10",
                !isSelected && "hover:bg-[#fafafa] dark:hover:bg-[#262626]",
              )}
            >
              <span className={cn("text-sm font-semibold", isOutside ? "text-[#c4c4c4]" : "text-[#171717] dark:text-[#f5f5f5]")}>{cellDate.getDate()}</span>
              <div className="space-y-1">
                {cellEvents.slice(0, 2).map((event) => (
                  <div key={event.id} className="rounded-full bg-[#2563EB]/10 px-2 py-0.5 text-[10px] font-medium text-[#2563EB]">
                    {event.title}
                  </div>
                ))}
                {cellEvents.length > 2 && <p className="text-[10px] text-[#a3a3a3]">+{cellEvents.length - 2}개</p>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
