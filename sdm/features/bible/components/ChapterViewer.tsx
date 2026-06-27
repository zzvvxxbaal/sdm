"use client";

import { cn } from "@/lib/utils";
import type { BibleVerse } from "@/types/bible";
import type { BibleBook } from "@/models/bible_book";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ChapterViewerProps {
  book: BibleBook | undefined;
  chapterNumber: number;
  verses: BibleVerse[];
  onPrevious: () => void;
  onNext: () => void;
}

export function ChapterViewer({
  book,
  chapterNumber,
  verses,
  onPrevious,
  onNext,
}: ChapterViewerProps) {
  if (!book) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Chapter Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e5e5] dark:border-[#2c2c2e]">
        <button
          onClick={onPrevious}
          className={cn(
            "flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[#525252]",
            "hover:bg-[#f5f5f5] transition-colors dark:text-[#a3a3a3] dark:hover:bg-[#262626]"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">이전</span>
        </button>

        <h2 className="text-base font-bold text-[#171717] dark:text-[#f5f5f5]">
          {book.name} {chapterNumber}장
        </h2>

        <button
          onClick={onNext}
          className={cn(
            "flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-[#525252]",
            "hover:bg-[#f5f5f5] transition-colors dark:text-[#a3a3a3] dark:hover:bg-[#262626]"
          )}
        >
          <span className="hidden sm:inline">다음</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Verses */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-3">
          {verses.map((verse) => (
            <div key={verse.id} className="flex gap-3 group">
              <span className="mt-0.5 flex h-5 min-w-[1.5rem] items-center justify-center rounded-md bg-[#eff6ff] text-xs font-bold text-[#2563EB] dark:bg-[#1e3a5f] dark:text-[#60a5fa]">
                {verse.verseNumber}
              </span>
              <p className="text-[15px] leading-[1.75] text-[#171717] dark:text-[#f5f5f5]">
                {verse.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
