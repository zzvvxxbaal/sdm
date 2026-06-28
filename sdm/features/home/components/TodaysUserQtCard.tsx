"use client";

import Link from "next/link";
import { BookOpen, ChevronRight, Loader2 } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { SectionError } from "./SectionError";
import { EmptyState } from "@/components/ui";
import { useQT } from "@/hooks/useQT";

export function TodaysUserQtCard() {
  const { todayQT, loading, error } = useQT();

  return (
    <SectionCard title="내 QT">
      {error ? (
        <SectionError message="QT를 불러오지 못했습니다" />
      ) : loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-[#2563EB]" />
        </div>
      ) : todayQT ? (
        <Link
          href="/qt"
          className="flex items-start gap-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] p-4 transition-colors hover:bg-[#f5f5f5] dark:border-[#2c2c2e] dark:bg-[#262626] dark:hover:bg-[#2c2c2e]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#171717] dark:text-[#f5f5f5]">
              {todayQT.title}
            </p>
            <p className="mt-0.5 text-xs text-[#737373] dark:text-[#a3a3a3]">
              {todayQT.bibleReference.bookName} {todayQT.bibleReference.chapterNumber}:
              {todayQT.bibleReference.startVerse}
              {todayQT.bibleReference.endVerse && `-${todayQT.bibleReference.endVerse}`}
            </p>
            {todayQT.meditation && (
              <p className="mt-1 line-clamp-2 text-xs text-[#525252] dark:text-[#d1d1d1]">
                {todayQT.meditation}
              </p>
            )}
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-[#a3a3a3]" />
        </Link>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="오늘의 QT가 없습니다"
          description="QT를 작성해 영적 성장을 기록해보세요"
        />
      )}
    </SectionCard>
  );
}
