"use client";

import { useState, useCallback } from "react";
import type { BibleVerse, BibleSearchResult } from "@/types/bible";

let bibleDataCache: { verses: BibleVerse[] } | null = null;

async function loadBibleData() {
  if (bibleDataCache) return bibleDataCache;
  const res = await fetch("/data/bible_parsed.json");
  const data = await res.json();
  bibleDataCache = data;
  return data;
}

export function useBibleSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BibleSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const data = await loadBibleData();
    const normalized = keyword.trim().toLowerCase();

    const filtered = data.verses
      .filter((v: BibleVerse) =>
        v.text.toLowerCase().includes(normalized) ||
        v.bookName.toLowerCase().includes(normalized)
      )
      .slice(0, 50)
      .map((v: BibleVerse) => ({
        verse: v,
        highlightedText: highlightText(v.text, keyword),
        matchScore: calculateScore(v.text, v.bookName, keyword),
      }));

    setResults(filtered);
    setLoading(false);
  }, []);

  const clear = useCallback(() => {
    setQuery("");
    setResults([]);
  }, []);

  return { query, setQuery, results, loading, search, clear };
}

function highlightText(text: string, keyword: string): string {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${escaped})`, "gi"), "<mark>$1</mark>");
}

function calculateScore(text: string, bookName: string, keyword: string): number {
  const k = keyword.toLowerCase();
  let score = 0;
  const t = text.toLowerCase();
  const b = bookName.toLowerCase();
  if (t.startsWith(k)) score += 10;
  score += (t.match(new RegExp(k, "g")) || []).length * 2;
  score += (t.match(new RegExp(`\\b${k}\\b`, "g")) || []).length * 5;
  if (b.includes(k)) score += 3;
  return score;
}
