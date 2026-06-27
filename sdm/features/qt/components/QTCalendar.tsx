"use client";

import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { QTCalendarDay } from "@/types/qt";

interface QTCalendarProps {
  currentMonth: Date;
  selectedDate: string;
  days: QTCalendarDay[];
  streakDays: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: string) => void;
}

export function QTCalendar({ currentMonth, selectedDate, days, streakDays, onPreviousMonth, onNextMonth, onSelectDate }: QTCalendarProps) {
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const blanks = Array.from({ length: firstDay });
  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-4 dark:border-[#2c2c2e] dark:bg-[#1c1c1e]">
      <div className="mb-3 flex items-center justify-between">
        <button onClick={onPreviousMonth} className="rounded-lg p-2 text-[#737373] hover:bg-[#f5f5f5] dark:hover:bg-[#262626]">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <h2 className="text-base font-bold text-[#171717] dark:text-[#f5f5f5]">{format(currentMonth, "yyyy년 M월", { locale: ko })}</h2>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#f97316]"><Flame className="h-3.5 w-3.5" />연속 {streakDays}일</p>
        </div>
        <button onClick={onNextMonth} className="rounded-lg p-2 text-[#737373] hover:bg-[#f5f5f5] dark:hover:bg-[#262626]">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#a3a3a3]">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {blanks.map((_, index) => <div key={`blank-${index}`} className="h-12" />)}
        {days.map((day) => {
          const number = Number(day.date.slice(-2));
          const active = day.date === selectedDate;
          return (
            <button
              key={day.date}
              onClick={() => onSelectDate(day.date)}
              className={cn(
                "relative flex h-12 flex-col items-center justify-center rounded-xl text-sm transition-colors",
                active ? "bg-[#2563EB] text-white" : "hover:bg-[#f5f5f5] dark:hover:bg-[#262626]",
              )}
            >
              <span className="font-semibold">{number}</span>
              {day.hasQT && (
                <span className={cn("mt-1 h-1.5 w-1.5 rounded-full", active ? "bg-white" : day.isFavorite ? "bg-[#f97316]" : "bg-[#2563EB]")} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
