"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Search, X, Loader2 } from "lucide-react";
import type { BibleSearchResult } from "@/types/bible";

interface BibleSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  results: BibleSearchResult[];
  loading: boolean;
  onSearch: (query: string) => void;
  onClear: () => void;
  onSelectVerse: (verseId: string) => void;
}

export function BibleSearch({
  query,
  onQueryChange,
  results,
  loading,
  onSearch,
  onClear,
  onSelectVerse,
}: BibleSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(() => onSearch(query), 300);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, onSearch]);

  return (
    <div className="relative">
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 transition-all",
          "border-[#e5e5e5] focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/10",
          "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:focus-within:border-[#2563EB] dark:focus-within:ring-[#2563EB]/20"
        )}
      >
        <Search className="h-4 w-4 text-[#a3a3a3]" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            onQueryChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="성경 검색 (예: 사랑, 요한복음 3:16)"
          className="flex-1 bg-transparent text-sm text-[#171717] placeholder:text-[#a3a3a3] outline-none dark:text-[#f5f5f5]"
        />
        {loading && <Loader2 className="h-4 w-4 animate-spin text-[#a3a3a3]" />}
        {query && (
          <button
            onClick={() => {
              onClear();
              inputRef.current?.focus();
            }}
            className="rounded-md p-0.5 hover:bg-[#f5f5f5] dark:hover:bg-[#262626]"
          >
            <X className="h-4 w-4 text-[#a3a3a3]" />
          </button>
        )}
      </div>

      {isOpen && query.trim().length >= 2 && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className={cn(
              "absolute top-full left-0 z-50 mt-2 w-full max-h-[400px] overflow-y-auto rounded-2xl",
              "bg-white border border-[#e5e5e5] shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)]",
              "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.4)]"
            )}
          >
            {results.length === 0 && !loading ? (
              <div className="px-4 py-8 text-center text-sm text-[#a3a3a3]">
                검색 결과가 없습니다.
              </div>
            ) : (
              <div className="py-2">
                {results.map((result) => (
                  <button
                    key={result.verse.id}
                    onClick={() => {
                      onSelectVerse(result.verse.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 text-left transition-colors hover:bg-[#f5f5f5]",
                      "dark:hover:bg-[#262626]"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#2563EB]">
                        {result.verse.bookName} {result.verse.chapterNumber}:{result.verse.verseNumber}
                      </span>
                    </div>
                    <p
                      className="text-sm text-[#171717] dark:text-[#f5f5f5] leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: result.highlightedText }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
