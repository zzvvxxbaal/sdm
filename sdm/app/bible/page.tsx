"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BookSelector, ChapterViewer, BibleSearch, VerseCard } from "@/features/bible";
import { useBibleReader } from "@/features/bible/hooks/useBibleReader";
import { useBibleSearch } from "@/features/bible/hooks/useBibleSearch";
import { Search, BookOpen } from "lucide-react";

type View = "reader" | "search";

export default function BiblePage() {
  const [view, setView] = useState<View>("reader");

  const {
    bookId,
    chapterNumber,
    verses,
    book,
    loading: readerLoading,
    goToChapter,
    goToNextChapter,
    goToPreviousChapter,
  } = useBibleReader("gen", 1);

  const {
    query,
    setQuery,
    results,
    loading: searchLoading,
    search,
    clear,
  } = useBibleSearch();

  const handleSelectVerse = (verseId: string) => {
    // Parse verseId to extract bookId and chapter
    const parts = verseId.split("_");
    if (parts.length >= 2) {
      const bid = parts[0];
      const ch = parseInt(parts[1], 10);
      if (!isNaN(ch)) {
        goToChapter(bid, ch);
        setView("reader");
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#f8fafc] dark:bg-[#0a0a0a]">
      {/* Top Bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e5e5e5] bg-white dark:bg-[#1c1c1e] dark:border-[#2c2c2e]">
        <BookSelector
          currentBookId={bookId}
          currentChapter={chapterNumber}
          onSelect={goToChapter}
        />

        <div className="flex-1" />

        <div className="flex items-center rounded-xl bg-[#f5f5f5] p-1 dark:bg-[#262626]">
          <button
            onClick={() => setView("reader")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              view === "reader"
                ? "bg-white text-[#2563EB] shadow-sm dark:bg-[#1c1c1e] dark:text-[#60a5fa]"
                : "text-[#737373] hover:text-[#171717] dark:text-[#a3a3a3]"
            )}
          >
            <BookOpen className="h-3.5 w-3.5" />
            읽기
          </button>
          <button
            onClick={() => setView("search")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              view === "search"
                ? "bg-white text-[#2563EB] shadow-sm dark:bg-[#1c1c1e] dark:text-[#60a5fa]"
                : "text-[#737373] hover:text-[#171717] dark:text-[#a3a3a3]"
            )}
          >
            <Search className="h-3.5 w-3.5" />
            검색
          </button>
        </div>
      </div>

      {/* Content */}
      {view === "reader" ? (
        readerLoading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e5e5e5] border-t-[#2563EB]" />
          </div>
        ) : (
          <ChapterViewer
            book={book}
            chapterNumber={chapterNumber}
            verses={verses}
            onPrevious={goToPreviousChapter}
            onNext={goToNextChapter}
          />
        )
      ) : (
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-4">
            <BibleSearch
              query={query}
              onQueryChange={setQuery}
              results={results}
              loading={searchLoading}
              onSearch={search}
              onClear={clear}
              onSelectVerse={handleSelectVerse}
            />
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {results.length > 0 ? (
              <div className="space-y-3">
                {results.map((result) => (
                  <VerseCard
                    key={result.verse.id}
                    verse={result.verse}
                    onBookmark={(v) => {
                      // TODO: Implement bookmark functionality
                    }}
                    onShare={(v) => {
                      // TODO: Implement share functionality
                    }}
                  />
                ))}
              </div>
            ) : query.trim().length >= 2 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="h-10 w-10 text-[#e5e5e5] mb-3" />
                <p className="text-sm text-[#a3a3a3]">검색 결과가 없습니다.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="h-10 w-10 text-[#e5e5e5] mb-3" />
                <p className="text-sm text-[#a3a3a3]">검색어를 입력해 주세요.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
