"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Heart, ChevronRight } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { SectionError } from "./SectionError";
import { usePrayers } from "@/hooks/usePrayers";
import { PrayerEditor } from "@/components/prayer/PrayerEditor";
import { cn } from "@/lib/utils";
import type { PrayerRequestModel } from "@/models/prayer_request";

export function RecentPrayersCard() {
  const { prayers, loading, error, createPrayer } = usePrayers();
  const [showEditor, setShowEditor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recentPrayers = prayers
    .filter((p) => !p.isAnswered)
    .slice(0, 3);

  const handleCreatePrayer = async (data: Omit<PrayerRequestModel, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">) => {
    setIsSubmitting(true);
    try {
      await createPrayer(data);
      setShowEditor(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionCard title="기도제목">
      {error ? (
        <SectionError message="기도제목을 불러오지 못했습니다" />
      ) : loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-[#2563EB]" />
        </div>
      ) : (
        <div className="space-y-3">
          {showEditor ? (
            <PrayerEditor onSubmit={handleCreatePrayer} isLoading={isSubmitting} />
          ) : (
            <button
              onClick={() => setShowEditor(true)}
              className={cn(
                "w-full rounded-xl border border-[#e5e5e5] bg-[#fafafa] p-4 text-left",
                "transition-colors hover:bg-[#f5f5f5]",
                "dark:border-[#2c2c2e] dark:bg-[#262626] dark:hover:bg-[#2c2c2e]"
              )}
            >
              <p className="text-sm text-[#a3a3a3] dark:text-[#737373]">
                기도제목을 등록해보세요...
              </p>
            </button>
          )}

          {/* Recent Prayers Preview */}
          {recentPrayers.length > 0 && (
            <div className="space-y-2">
              {recentPrayers.map((prayer) => (
                <Link
                  key={prayer.id}
                  href="/prayers"
                  className={cn(
                    "flex items-start gap-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] p-3",
                    "transition-colors hover:bg-[#f5f5f5]",
                    "dark:border-[#2c2c2e] dark:bg-[#262626] dark:hover:bg-[#2c2c2e]"
                  )}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                    <Heart className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[#171717] dark:text-[#f5f5f5]">
                      {prayer.isAnonymous ? "익명의 기도" : prayer.title}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-[#737373] dark:text-[#a3a3a3]">
                      {prayer.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Heart className="h-3 w-3 text-[#737373]" />
                    <span className="text-xs text-[#737373]">{prayer.prayerCount}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#a3a3a3]" />
                </Link>
              ))}

              {/* View All Link */}
              <Link
                href="/prayers"
                className={cn(
                  "flex items-center justify-between rounded-xl border border-[#e5e5e5] bg-[#fafafa] px-4 py-2.5",
                  "transition-colors hover:bg-[#f5f5f5]",
                  "text-xs font-medium text-[#2563EB]",
                  "dark:border-[#2c2c2e] dark:bg-[#262626] dark:hover:bg-[#2c2c2e]"
                )}
              >
                모든 기도제목 보기
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {recentPrayers.length === 0 && !showEditor && (
            <div className="rounded-xl border border-dashed border-[#d1d5db] px-4 py-6 text-center dark:border-[#2c2c2e]">
              <p className="text-xs text-[#737373]">아직 기도제목이 없습니다</p>
            </div>
          )}
        </div>
      )}
    </SectionCard>
  );
}
