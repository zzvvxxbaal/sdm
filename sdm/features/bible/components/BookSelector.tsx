"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  OLD_TESTAMENT_BOOKS,
  NEW_TESTAMENT_BOOKS,
  type BibleBook,
} from "@/models/bible_book";
import { BookOpen, ChevronDown } from "lucide-react";

interface BookSelectorProps {
  currentBookId: string;
  currentChapter: number;
  onSelect: (bookId: string, chapter: number) => void;
}

type Tab = "old" | "new";

export function BookSelector({ currentBookId, currentChapter, onSelect }: BookSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("old");

  const currentBook = useMemo(
    () => OLD_TESTAMENT_BOOKS.find((b) => b.id === currentBookId) ||
          NEW_TESTAMENT_BOOKS.find((b) => b.id === currentBookId),
    [currentBookId]
  );

  const books = tab === "old" ? OLD_TESTAMENT_BOOKS : NEW_TESTAMENT_BOOKS;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold",
          "bg-white border border-[#e5e5e5] text-[#171717]",
          "hover:bg-[#fafafa] transition-all",
          "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#f5f5f5] dark:hover:bg-[#262626]"
        )}
      >
        <BookOpen className="h-4 w-4 text-[#2563EB]" />
        <span>
          {currentBook?.name} {currentChapter}장
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className={cn(
              "absolute top-full left-0 z-50 mt-2 w-[320px] rounded-2xl",
              "bg-white border border-[#e5e5e5] shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)]",
              "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.4)]"
            )}
          >
            <div className="flex border-b border-[#e5e5e5] dark:border-[#2c2c2e]">
              <TabButton label="구약" active={tab === "old"} onClick={() => setTab("old")} />
              <TabButton label="신약" active={tab === "new"} onClick={() => setTab("new")} />
            </div>

            <div className="max-h-[400px] overflow-y-auto p-3">
              <div className="grid grid-cols-1 gap-1">
                {books.map((book) => (
                  <BookRow
                    key={book.id}
                    book={book}
                    isActive={book.id === currentBookId}
                    currentChapter={currentChapter}
                    onSelect={(chapter) => {
                      onSelect(book.id, chapter);
                      setIsOpen(false);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 py-3 text-sm font-semibold transition-colors",
        active
          ? "text-[#2563EB] border-b-2 border-[#2563EB]"
          : "text-[#737373] hover:text-[#171717] dark:text-[#a3a3a3] dark:hover:text-[#f5f5f5]"
      )}
    >
      {label}
    </button>
  );
}

function BookRow({
  book,
  isActive,
  currentChapter,
  onSelect,
}: {
  book: BibleBook;
  isActive: boolean;
  currentChapter: number;
  onSelect: (chapter: number) => void;
}) {
  const [expanded, setExpanded] = useState(isActive);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-[#eff6ff] text-[#2563EB] font-semibold dark:bg-[#1e3a5f]"
            : "text-[#171717] hover:bg-[#f5f5f5] dark:text-[#f5f5f5] dark:hover:bg-[#262626]"
        )}
      >
        <span>{book.name}</span>
        <span className="text-xs text-[#a3a3a3]">{book.chapterCount}장</span>
      </button>

      {expanded && (
        <div className="grid grid-cols-5 gap-1 px-3 pb-2 pt-1">
          {Array.from({ length: book.chapterCount }, (_, i) => i + 1).map((ch) => (
            <button
              key={ch}
              onClick={() => onSelect(ch)}
              className={cn(
                "h-8 rounded-md text-xs font-medium transition-colors",
                isActive && ch === currentChapter
                  ? "bg-[#2563EB] text-white"
                  : "bg-[#f5f5f5] text-[#525252] hover:bg-[#e5e5e5] dark:bg-[#262626] dark:text-[#a3a3a3] dark:hover:bg-[#333333]"
              )}
            >
              {ch}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
