"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { usePrayers } from "@/hooks/usePrayers";
import { PrayerList, PrayerEditor } from "@/components/prayer";
import { cn } from "@/lib/utils";

export default function PrayersPage() {
  const {
    prayers,
    loading,
    createPrayer,
    markAsAnswered,
    markAsUnanswered,
    deletePrayer,
    incrementPrayerCount,
  } = usePrayers();

  const [showEditor, setShowEditor] = useState(false);
  const [showAnswered, setShowAnswered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePrayer = async (data: any) => {
    setIsSubmitting(true);
    try {
      await createPrayer(data);
      setShowEditor(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-lg space-y-4 px-4 pb-24 pt-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              "bg-[#f3f4f6] hover:bg-[#e5e7eb]",
              "dark:bg-[#2c2c2e] dark:hover:bg-[#3c3c3e]",
              "transition-colors"
            )}
          >
            <ChevronLeft className="w-5 h-5 text-[#171717] dark:text-[#f5f5f5]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#171717] dark:text-[#f5f5f5]">
              기도제목
            </h1>
            <p className="text-xs text-[#737373] dark:text-[#a3a3a3] mt-0.5">
              공동체와 함께 기도합니다
            </p>
          </div>
        </div>

        {/* Editor Section */}
        {showEditor ? (
          <div className={cn(
            "rounded-xl border border-[#e5e5e5] bg-white p-4",
            "dark:bg-[#1c1c1e] dark:border-[#2c2c2e]"
          )}>
            <PrayerEditor
              onSubmit={handleCreatePrayer}
              isLoading={isSubmitting}
            />
            <button
              onClick={() => setShowEditor(false)}
              className={cn(
                "w-full mt-3 px-4 py-2 text-sm font-medium rounded-lg",
                "bg-[#f3f4f6] text-[#171717] hover:bg-[#e5e7eb]",
                "dark:bg-[#2c2c2e] dark:text-[#f5f5f5] dark:hover:bg-[#3c3c3e]",
                "transition-colors"
              )}
            >
              취소
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowEditor(true)}
            className={cn(
              "w-full rounded-xl border-2 border-dashed border-[#2563EB] bg-[#eff6ff] p-4",
              "hover:bg-[#dbeafe] transition-colors",
              "dark:bg-[#1c2c3e] dark:hover:bg-[#233651]",
              "text-center text-sm font-medium text-[#2563EB]"
            )}
          >
            + 새로운 기도제목 등록
          </button>
        )}

        {/* Prayer List */}
        <PrayerList
          prayers={prayers}
          loading={loading}
          onMarkAnswered={markAsAnswered}
          onMarkUnanswered={markAsUnanswered}
          onDelete={deletePrayer}
          onSupportClick={incrementPrayerCount}
          showAnswered={showAnswered}
          onShowAnsweredChange={setShowAnswered}
          title={showAnswered ? "답변된 기도제목" : "기도제목"}
          emptyMessage={showAnswered ? "답변된 기도제목이 없습니다" : "기도제목이 없습니다"}
        />
      </div>
    </div>
  );
}
