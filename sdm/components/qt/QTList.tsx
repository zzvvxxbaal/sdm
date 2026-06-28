"use client";

import { cn } from "@/lib/utils";
import { BookOpen, Heart, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { QTEntry } from "@/types/qt";

interface QTListProps {
  entries: QTEntry[];
  onDelete?: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function QTList({ entries, onDelete, isLoading = false }: QTListProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-[#e5e5e5] px-4 py-12 text-center dark:border-[#2c2c2e]">
        <BookOpen className="mx-auto h-8 w-8 text-[#a3a3a3] mb-2" />
        <p className="text-sm font-medium text-[#737373] dark:text-[#a3a3a3]">
          저장된 QT가 없습니다
        </p>
        <p className="text-xs text-[#a3a3a3] dark:text-[#666666] mt-1">
          새로운 QT를 작성해 시작해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className={cn(
            "rounded-xl border border-[#e5e5e5] bg-white p-4 transition-all",
            "hover:shadow-sm dark:bg-[#1c1c1e] dark:border-[#2c2c2e]"
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#171717] dark:text-[#f5f5f5] truncate">
                {entry.title}
              </p>
              <p className="text-xs text-[#737373] dark:text-[#a3a3a3] mt-0.5">
                {format(new Date(entry.createdAt), "M월 d일 (EEE)", { locale: ko })}
              </p>
            </div>
            {onDelete && (
              <button
                onClick={() => onDelete(entry.id)}
                disabled={isLoading}
                className={cn(
                  "shrink-0 h-8 w-8 rounded-lg flex items-center justify-center",
                  "text-[#a3a3a3] hover:bg-[#f5f5f5] hover:text-[#dc2626] transition-colors",
                  "dark:hover:bg-[#262626]",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Bible Reference */}
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-3.5 w-3.5 text-[#2563EB]" />
            <p className="text-xs text-[#737373] dark:text-[#a3a3a3]">
              {entry.bibleReference.bookName} {entry.bibleReference.chapterNumber}:
              {entry.bibleReference.startVerse}
              {entry.bibleReference.endVerse && `-${entry.bibleReference.endVerse}`}
            </p>
          </div>

          {/* Content Preview */}
          {entry.meditation && (
            <div className="mb-2">
              <p className="text-xs font-medium text-[#a3a3a3] mb-1">관찰</p>
              <p className="text-xs text-[#525252] dark:text-[#d1d1d1] line-clamp-2">
                {entry.meditation}
              </p>
            </div>
          )}

          {entry.application && (
            <div className="mb-2">
              <p className="text-xs font-medium text-[#a3a3a3] mb-1">적용</p>
              <p className="text-xs text-[#525252] dark:text-[#d1d1d1] line-clamp-2">
                {entry.application}
              </p>
            </div>
          )}

          {entry.prayer && (
            <div>
              <p className="text-xs font-medium text-[#a3a3a3] mb-1">기도</p>
              <p className="text-xs text-[#525252] dark:text-[#d1d1d1] line-clamp-2">
                {entry.prayer}
              </p>
            </div>
          )}

          {/* Tags and Metadata */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {entry.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full",
                    "bg-[#2563EB]/10 text-[#2563EB] text-[10px] font-medium",
                    "dark:bg-[#2563EB]/20"
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
