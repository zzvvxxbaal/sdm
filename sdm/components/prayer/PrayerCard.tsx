"use client";

import { cn, toDate } from "@/lib/utils";
import { Heart, Loader2, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import type { PrayerRequestModel } from "@/models/prayer_request";
import { useRole } from "@/hooks/useRole";
import { isLeader, isAdmin } from "@/types/role";

interface PrayerCardProps {
  prayer: PrayerRequestModel & { id: string };
  onMarkAnswered?: () => Promise<void>;
  onMarkUnanswered?: () => Promise<void>;
  onDelete?: () => Promise<void>;
  onSupportClick?: () => Promise<void>;
  isLoading?: boolean;
  isSupported?: boolean;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  personal: { bg: "bg-blue-50", text: "text-blue-700", label: "개인" },
  family: { bg: "bg-purple-50", text: "text-purple-700", label: "가정" },
  church: { bg: "bg-amber-50", text: "text-amber-700", label: "교회" },
  mission: { bg: "bg-green-50", text: "text-green-700", label: "선교" },
  healing: { bg: "bg-red-50", text: "text-red-700", label: "치유" },
  other: { bg: "bg-gray-50", text: "text-gray-700", label: "기타" },
};

export function PrayerCard({
  prayer,
  onMarkAnswered,
  onMarkUnanswered,
  onDelete,
  onSupportClick,
  isLoading = false,
  isSupported = false,
}: PrayerCardProps) {
  const { role } = useRole();

  const canMarkAnswered = role ? isLeader(role) || isAdmin(role) : false;
  const canDelete = role ? isAdmin(role) : false;

  const createdAtTime = toDate(prayer.createdAt);

  const timeAgo = formatDistanceToNow(createdAtTime, {
    locale: ko,
    addSuffix: true,
  });

  const categoryColor = CATEGORY_COLORS[prayer.category] || CATEGORY_COLORS.other;

  return (
    <div
      className={cn(
        "rounded-xl border p-4 bg-white dark:bg-[#1c1c1e]",
        prayer.isAnswered ? "border-[#d1d5db] bg-[#f9fafb]" : "border-[#e5e5e5]",
        "dark:border-[#2c2c2e]"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-semibold text-sm break-words",
              prayer.isAnswered
                ? "line-through text-[#a3a3a3]"
                : "text-[#171717] dark:text-[#f5f5f5]"
            )}
          >
            {prayer.title}
          </h3>
          <p className="text-xs text-[#737373] mt-1">
            {prayer.isAnonymous ? "익명의 기도" : "기도"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {canDelete && (
            <button
              onClick={onDelete}
              disabled={isLoading}
              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 dark:hover:bg-red-950"
              title="삭제"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-red-600" />
              ) : (
                <X className="w-4 h-4 text-[#737373]" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <p
        className={cn(
          "text-sm mt-3 leading-relaxed",
          prayer.isAnswered
            ? "text-[#a3a3a3] line-through"
            : "text-[#404040] dark:text-[#e5e5e5]"
        )}
      >
        {prayer.content}
      </p>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-[#e5e5e5] dark:border-[#2c2c2e]">
        <div className="flex items-center gap-2">
          {/* Category Badge */}
          <span
            className={cn(
              "inline-block px-2.5 py-1 rounded-lg text-xs font-medium",
              categoryColor.bg,
              categoryColor.text,
              "dark:opacity-75"
            )}
          >
            {categoryColor.label}
          </span>

          {/* Answered Badge */}
          {prayer.isAnswered && (
            <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700 dark:opacity-75">
              답변됨
            </span>
          )}

          {/* Time */}
          <span className="text-xs text-[#a3a3a3]">{timeAgo}</span>
        </div>

        {/* Prayer Count & Actions */}
        <div className="flex items-center gap-2">
          {/* Prayer Count */}
          <button
            onClick={onSupportClick}
            disabled={isLoading}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
              isSupported
                ? "bg-red-50 text-red-600 dark:opacity-75"
                : "bg-[#f3f4f6] text-[#737373] hover:bg-[#e5e7eb] dark:bg-[#2c2c2e] dark:hover:bg-[#3c3c3e] dark:text-[#a3a3a3]",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Heart className={cn("w-3.5 h-3.5", isSupported ? "fill-current" : "")} />
            <span>{prayer.prayerCount}</span>
          </button>

          {/* Mark Answered Button */}
          {canMarkAnswered && !prayer.isAnswered && (
            <button
              onClick={onMarkAnswered}
              disabled={isLoading}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium",
                "bg-green-50 text-green-700 hover:bg-green-100",
                "dark:opacity-75 dark:hover:opacity-100",
                "transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "답변됨"}
            </button>
          )}

          {/* Mark Unanswered Button */}
          {canMarkAnswered && prayer.isAnswered && (
            <button
              onClick={onMarkUnanswered}
              disabled={isLoading}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium",
                "bg-amber-50 text-amber-700 hover:bg-amber-100",
                "dark:opacity-75 dark:hover:opacity-100",
                "transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "답변 취소"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
