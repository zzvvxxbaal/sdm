"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { BibleVerse } from "@/types/bible";
import { getBookById, getNextBook, getPreviousBook, BIBLE_BOOKS } from "@/models/bible_book";

interface BibleData {
  verses: BibleVerse[];
  stats: {
    totalVerses: number;
    totalBooks: number;
    totalChapters: number;
    oldTestamentVerses: number;
    newTestamentVerses: number;
  };
}

let bibleDataCache: BibleData | null = null;

async function loadBibleData(): Promise<BibleData> {
  if (bibleDataCache) return bibleDataCache;
  const res = await fetch("/data/bible_parsed.json");
  const data = await res.json();
  bibleDataCache = data;
  return data;
}

export function useBibleReader(initialBookId: string = "gen", initialChapter: number = 1) {
  const [bookId, setBookId] = useState(initialBookId);
  const [chapterNumber, setChapterNumber] = useState(initialChapter);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [bibleData, setBibleData] = useState<BibleData | null>(null);

  useEffect(() => {
    loadBibleData().then((data) => {
      setBibleData(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!bibleData) return;
    const chapterVerses = bibleData.verses.filter(
      (v) => v.bookId === bookId && v.chapterNumber === chapterNumber
    );
    setVerses(chapterVerses);
  }, [bookId, chapterNumber, bibleData]);

  const book = useMemo(() => getBookById(bookId), [bookId]);

  const goToChapter = useCallback((bid: string, ch: number) => {
    setBookId(bid);
    setChapterNumber(ch);
  }, []);

  const goToNextChapter = useCallback(() => {
    if (!book) return;
    if (chapterNumber < book.chapterCount) {
      setChapterNumber((prev) => prev + 1);
    } else {
      const next = getNextBook(bookId);
      if (next) {
        setBookId(next.id);
        setChapterNumber(1);
      }
    }
  }, [book, bookId, chapterNumber]);

  const goToPreviousChapter = useCallback(() => {
    if (!book) return;
    if (chapterNumber > 1) {
      setChapterNumber((prev) => prev - 1);
    } else {
      const prev = getPreviousBook(bookId);
      if (prev) {
        setBookId(prev.id);
        setChapterNumber(prev.chapterCount);
      }
    }
  }, [book, bookId, chapterNumber]);

  const getChapterCount = useCallback(
    (bid: string) => {
      const b = BIBLE_BOOKS.find((x) => x.id === bid);
      return b?.chapterCount ?? 0;
    },
    []
  );

  return {
    bookId,
    chapterNumber,
    verses,
    book,
    loading,
    goToChapter,
    goToNextChapter,
    goToPreviousChapter,
    getChapterCount,
  };
}
