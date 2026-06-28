"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Loader2, Filter } from "lucide-react";
import { PrayerCard } from "./PrayerCard";
import type { PrayerRequestModel } from "@/models/prayer_request";

interface PrayerListProps {
  prayers: (PrayerRequestModel & { id: string })[];
  loading?: boolean;
  onMarkAnswered?: (prayerId: string) => Promise<void>;
  onMarkUnanswered?: (prayerId: string) => Promise<void>;
  onDelete?: (prayerId: string) => Promise<void>;
  onSupportClick?: (prayerId: string) => Promise<void>;
  showAnswered?: boolean;
  onShowAnsweredChange?: (show: boolean) => void;
  title?: string;
  emptyMessage?: string;
}

export function PrayerList({
  prayers,
  loading = false,
  onMarkAnswered,
  onMarkUnanswered,
  onDelete,
  onSupportClick,
  showAnswered = false,
  onShowAnsweredChange,
  title = "기도제목",
  emptyMessage = "기도제목이 없습니다",
}: PrayerListProps) {
  const [supportedPrayers, setSupportedPrayers] = useState<Set<string>>(new Set());
  const [loadingPrayers, setLoadingPrayers] = useState<Set<string>>(new Set());

  const filteredPrayers = showAnswered
    ? prayers
    : prayers.filter((p) => !p.isAnswered);

  const handleSupportClick = async (prayerId: string) => {
    setLoadingPrayers((prev) => new Set(prev).add(prayerId));
    try {
      await onSupportClick?.(prayerId);
      setSupportedPrayers((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(prayerId)) {
          newSet.delete(prayerId);
        } else {
          newSet.add(prayerId);
        }
        return newSet;
      });
    } finally {
      setLoadingPrayers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(prayerId);
        return newSet;
      });
    }
  };

  const handleMarkAnswered = async (prayerId: string) => {
    setLoadingPrayers((prev) => new Set(prev).add(prayerId));
    try {
      await onMarkAnswered?.(prayerId);
    } finally {
      setLoadingPrayers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(prayerId);
        return newSet;
      });
    }
  };

  const handleMarkUnanswered = async (prayerId: string) => {
    setLoadingPrayers((prev) => new Set(prev).add(prayerId));
    try {
      await onMarkUnanswered?.(prayerId);
    } finally {
      setLoadingPrayers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(prayerId);
        return newSet;
      });
    }
  };

  const handleDelete = async (prayerId: string) => {
    setLoadingPrayers((prev) => new Set(prev).add(prayerId));
    try {
      await onDelete?.(prayerId);
    } finally {
      setLoadingPrayers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(prayerId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-[#171717] dark:text-[#f5f5f5]">{title}</h2>
        {onShowAnsweredChange && (
          <button
            onClick={() => onShowAnsweredChange(!showAnswered)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              showAnswered
                ? "bg-[#2563EB] text-white"
                : "bg-[#f3f4f6] text-[#737373] hover:bg-[#e5e7eb] dark:bg-[#2c2c2e] dark:text-[#a3a3a3] dark:hover:bg-[#3c3c3e]"
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            {showAnswered ? "모두 보기" : "답변된 기도"}
          </button>
        )}
      </div>

      {/* Prayer List */}
      {filteredPrayers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#d1d5db] p-8 text-center dark:border-[#2c2c2e]">
          <p className="text-sm text-[#737373]">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPrayers.map((prayer) => (
            <PrayerCard
              key={prayer.id}
              prayer={prayer}
              onMarkAnswered={() => handleMarkAnswered(prayer.id)}
              onMarkUnanswered={() => handleMarkUnanswered(prayer.id)}
              onDelete={() => handleDelete(prayer.id)}
              onSupportClick={() => handleSupportClick(prayer.id)}
              isLoading={loadingPrayers.has(prayer.id)}
              isSupported={supportedPrayers.has(prayer.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
