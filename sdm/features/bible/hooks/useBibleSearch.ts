"use client";

import { useCallback, useState } from "react";
import { searchBible } from "@/services/bible/bibleService";
import type { BibleSearchResult } from "@/types/bible";

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
    try {
      setResults(await searchBible(keyword));
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setQuery("");
    setResults([]);
  }, []);

  return { query, setQuery, results, loading, search, clear };
}
