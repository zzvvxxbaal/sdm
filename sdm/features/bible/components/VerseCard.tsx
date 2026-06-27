"use client";

import { cn } from "@/lib/utils";
import { Bookmark, Share2 } from "lucide-react";
import type { BibleVerse } from "@/types/bible";

interface VerseCardProps {
  verse: BibleVerse;
  onBookmark?: (verse: BibleVerse) => void;
  onShare?: (verse: BibleVerse) => void;
  className?: string;
}

export function VerseCard({ verse, onBookmark, onShare, className }: VerseCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#e5e5e5] bg-white p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]",
        "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.3)]",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-[#2563EB]">
          {verse.bookName} {verse.chapterNumber}:{verse.verseNumber}
        </span>
        <div className="flex gap-1">
          {onBookmark && (
            <button
              onClick={() => onBookmark(verse)}
              className="rounded-lg p-1.5 text-[#a3a3a3] hover:bg-[#f5f5f5] hover:text-[#2563EB] transition-colors dark:hover:bg-[#262626]"
            >
              <Bookmark className="h-4 w-4" />
            </button>
          )}
          {onShare && (
            <button
              onClick={() => onShare(verse)}
              className="rounded-lg p-1.5 text-[#a3a3a3] hover:bg-[#f5f5f5] hover:text-[#2563EB] transition-colors dark:hover:bg-[#262626]"
            >
              <Share2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <p className="text-[15px] leading-[1.75] text-[#171717] dark:text-[#f5f5f5]">
        {verse.text}
      </p>
    </div>
  );
}
