"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar, ChevronLeft, ChevronRight, BookOpen, Heart, Share2 } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function QtPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days: { day: number; date: Date; isToday: boolean; isSelected: boolean }[] = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push({ day: 0, date: new Date(), isToday: false, isSelected: false });
  }
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    days.push({
      day: i,
      date: d,
      isToday: d.toDateString() === today.toDateString(),
      isSelected: d.toDateString() === selectedDate.toDateString(),
    });
  }

  const [title, setTitle] = useState("");
  const [scripture, setScripture] = useState("");
  const [observation, setObservation] = useState("");
  const [application, setApplication] = useState("");
  const [prayer, setPrayer] = useState("");

  const isTodaySelected = selectedDate.toDateString() === today.toDateString();

  return (
    <div className="flex flex-col min-h-[calc(100dvh-120px)]">
      {/* Calendar Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={goToPreviousMonth}
            className="rounded-lg p-2 text-[#737373] hover:bg-[#f5f5f5] dark:hover:bg-[#262626]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-base font-bold text-[#171717] dark:text-[#f5f5f5]">
            {format(currentMonth, "yyyy년 M월", { locale: ko })}
          </h2>
          <button
            onClick={goToNextMonth}
            className="rounded-lg p-2 text-[#737373] hover:bg-[#f5f5f5] dark:hover:bg-[#262626]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <div
              key={d}
              className="text-center text-[10px] font-semibold text-[#a3a3a3] py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) =>
            d.day === 0 ? (
              <div key={i} className="h-10" />
            ) : (
              <button
                key={d.date.toISOString()}
                onClick={() => setSelectedDate(d.date)}
                className={cn(
                  "h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all",
                  d.isSelected
                    ? "bg-[#2563EB] text-white shadow-sm"
                    : d.isToday
                    ? "bg-[#eff6ff] text-[#2563EB] font-bold"
                    : "text-[#171717] hover:bg-[#f5f5f5] dark:text-[#f5f5f5] dark:hover:bg-[#262626]"
                )}
              >
                {d.day}
              </button>
            )
          )}
        </div>
      </div>

      {/* QT Form */}
      <div className="flex-1 px-4 py-4 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="h-4 w-4 text-[#2563EB]" />
          <span className="text-sm font-semibold text-[#171717] dark:text-[#f5f5f5]">
            {isTodaySelected ? "오늘의 QT" : format(selectedDate, "M월 d일", { locale: ko }) + " QT"}
          </span>
        </div>

        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목 (예: 사랑의 힘)"
          className={cn(
            "w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm",
            "placeholder:text-[#a3a3a3] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10",
            "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#f5f5f5]"
          )}
        />

        {/* Scripture Reference */}
        <div className="relative">
          <BookOpen className="absolute left-3 top-3 h-4 w-4 text-[#a3a3a3]" />
          <input
            value={scripture}
            onChange={(e) => setScripture(e.target.value)}
            placeholder="매일 약 본 범위 (예: 창세기 1:1-3)"
            className={cn(
              "w-full rounded-xl border border-[#e5e5e5] bg-white pl-10 pr-4 py-3 text-sm",
              "placeholder:text-[#a3a3a3] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10",
              "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#f5f5f5]"
            )}
          />
        </div>

        {/* Observation */}
        <div>
          <label className="text-xs font-semibold text-[#737373] mb-1.5 block">관찰 (Observation)</label>
          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="성경 범위에서 뭐라고 말하고 있나요?"
            rows={4}
            className={cn(
              "w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm resize-none",
              "placeholder:text-[#a3a3a3] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10",
              "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#f5f5f5]"
            )}
          />
        </div>

        {/* Application */}
        <div>
          <label className="text-xs font-semibold text-[#737373] mb-1.5 block">적용 (Application)</label>
          <textarea
            value={application}
            onChange={(e) => setApplication(e.target.value)}
            placeholder="오늘 나의 산업과 가정, 인권 관계 등에 어떻게 적용할 수 있나요?"
            rows={4}
            className={cn(
              "w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm resize-none",
              "placeholder:text-[#a3a3a3] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10",
              "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#f5f5f5]"
            )}
          />
        </div>

        {/* Prayer */}
        <div>
          <label className="text-xs font-semibold text-[#737373] mb-1.5 block">기도 (Prayer)</label>
          <textarea
            value={prayer}
            onChange={(e) => setPrayer(e.target.value)}
            placeholder="주님께서 내 산업에 대해 지시해주시고, 아미 같은 이 하루를 산것으로 나아게 돼주소서."
            rows={4}
            className={cn(
              "w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm resize-none",
              "placeholder:text-[#a3a3a3] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10",
              "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#f5f5f5]"
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2 pb-8">
          <button
            className={cn(
              "flex-1 h-12 rounded-xl bg-[#2563EB] text-white text-sm font-semibold",
              "hover:bg-[#1d4ed8] transition-colors active:scale-[0.98]"
            )}
          >
            <span className="flex items-center justify-center gap-2">
              <Heart className="h-4 w-4" />
              QT 저장하기
            </span>
          </button>
          <button
            className={cn(
              "h-12 w-12 rounded-xl border border-[#e5e5e5] bg-white",
              "flex items-center justify-center text-[#525252]",
              "hover:bg-[#f5f5f5] transition-colors",
              "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#a3a3a3] dark:hover:bg-[#262626]"
            )}
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
