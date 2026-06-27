"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getBookById, getNextBook, getPreviousBook } from "@/models/bible_book";
import { getChapterVerses, getResolvedReference } from "@/services/bible/bibleService";
import type { BibleVerse } from "@/types/bible";

export function useBibleReader(initialBookId = "gen", initialChapter = 1) {
  const [bookId, setBookId] = useState(initialBookId);
  const [chapterNumber, setChapterNumber] = useState(initialChapter);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void getChapterVerses(bookId, chapterNumber).then((chapterVerses) => {
      if (!active) return;
      setVerses(chapterVerses);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [bookId, chapterNumber]);

  const book = useMemo(() => getBookById(bookId), [bookId]);

  const goToChapter = useCallback((nextBookId: string, nextChapter: number) => {
    setBookId(nextBookId);
    setChapterNumber(nextChapter);
  }, []);

  const goToReference = useCallback(async (input: string) => {
    const resolved = await getResolvedReference(input);
    if (!resolved) return false;
    goToChapter(resolved.bookId, resolved.chapterNumber);
    return true;
  }, [goToChapter]);

  const goToNextChapter = useCallback(() => {
    if (!book) return;
    if (chapterNumber < book.chapterCount) setChapterNumber((value) => value + 1);
    else {
      const nextBook = getNextBook(bookId);
      if (nextBook) goToChapter(nextBook.id, 1);
    }
  }, [book, bookId, chapterNumber, goToChapter]);

  const goToPreviousChapter = useCallback(() => {
    if (!book) return;
    if (chapterNumber > 1) setChapterNumber((value) => value - 1);
    else {
      const previousBook = getPreviousBook(bookId);
      if (previousBook) goToChapter(previousBook.id, previousBook.chapterCount);
    }
  }, [book, bookId, chapterNumber, goToChapter]);

  return { bookId, chapterNumber, verses, book, loading, goToChapter, goToReference, goToNextChapter, goToPreviousChapter };
}
