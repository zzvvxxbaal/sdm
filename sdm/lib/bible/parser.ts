import { BIBLE_BOOKS, getBookById } from "@/models/bible_book";
import type { BibleVerse, BibleBook, BibleReference } from "@/types/bible";

export interface ParsedBibleLine {
  bookId: string;
  chapterNumber: number;
  verseNumber: number;
  text: string;
}

export interface ParsedBibleChapter {
  bookId: string;
  chapterNumber: number;
  verses: ParsedBibleVerse[];
}

export interface ParsedBibleVerse {
  verseNumber: number;
  text: string;
}

export interface ParsedBibleFile {
  books: Map<string, ParsedBibleChapter[]>;
  verses: BibleVerse[];
}

/**
 * Parses a Bible text file.
 * Expected format variations:
 * - "창 1:1 태초에 하나님이..."
 * - "창세기 1:1 태초에..."
 * - "창 1:1 태초에..."
 * - "1:1 태초에..."
 * - "1 태초에..."
 */
export function parseBibleText(rawText: string): ParsedBibleFile {
  const verses: BibleVerse[] = [];
  const books = new Map<string, ParsedBibleChapter[]>();

  const lines = rawText.split("\n").filter((line) => line.trim().length > 0);

  let currentBookId: string | null = null;
  let currentChapterNumber: number = 1;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0) continue;

    // Try to match a reference line like "창 1:1 ..." or "창세기 1:1 ..."
    const refMatch = trimmed.match(/^([\uac00-\ud7af]+)\s+(\d+):(\d+)\s+(.+)$/);

    if (refMatch) {
      const [, bookName, chapterStr, verseStr, text] = refMatch;
      const chapterNumber = parseInt(chapterStr, 10);
      const verseNumber = parseInt(verseStr, 10);

      const book = findBookByName(bookName);
      if (book) {
        currentBookId = book.id;
        currentChapterNumber = chapterNumber;

        const verse: BibleVerse = {
          id: `${book.id}_${chapterNumber}_${verseNumber}`,
          bookId: book.id,
          bookName: book.name,
          chapterNumber,
          verseNumber,
          text: text.trim(),
          testament: book.testament,
        };

        verses.push(verse);
        addVerseToChapterMap(books, verse);
      }
    } else {
      // Try to match just "1:1 ..." with current book
      const simpleRefMatch = trimmed.match(/^(\d+):(\d+)\s+(.+)$/);
      if (simpleRefMatch && currentBookId) {
        const [, chapterStr, verseStr, text] = simpleRefMatch;
        const chapterNumber = parseInt(chapterStr, 10);
        const verseNumber = parseInt(verseStr, 10);
        const book = getBookById(currentBookId);

        if (book) {
          currentChapterNumber = chapterNumber;

          const verse: BibleVerse = {
            id: `${book.id}_${chapterNumber}_${verseNumber}`,
            bookId: book.id,
            bookName: book.name,
            chapterNumber,
            verseNumber,
            text: text.trim(),
            testament: book.testament,
          };

          verses.push(verse);
          addVerseToChapterMap(books, verse);
        }
      }
    }
  }

  return { books, verses };
}

function findBookByName(name: string): BibleBook | undefined {
  return BIBLE_BOOKS.find(
    (b) => b.name === name || b.shortName === name || b.abbreviation === name
  );
}

function addVerseToChapterMap(books: Map<string, ParsedBibleChapter[]>, verse: BibleVerse): void {
  const chapters = books.get(verse.bookId) ?? [];
  let chapter = chapters.find((c) => c.chapterNumber === verse.chapterNumber);

  if (!chapter) {
    chapter = {
      bookId: verse.bookId,
      chapterNumber: verse.chapterNumber,
      verses: [],
    };
    chapters.push(chapter);
  }

  chapter.verses.push({
    verseNumber: verse.verseNumber,
    text: verse.text,
  });

  books.set(verse.bookId, chapters);
}

export function parseBibleReference(input: string): BibleReference | null {
  const normalized = input.trim().replace(/\s+/g, " ");

  // Patterns:
  // "창 1:1"
  // "창 1:1-3"
  // "창 1:1-2:3"
  // "요한복음 3:16"
  // "범용 1:1"

  const singleVersePattern = /^([\uac00-\ud7af]+)\s+(\d+):(\d+)$/;
  const rangePattern = /^([\uac00-\ud7af]+)\s+(\d+):(\d+)-(\d+)$/;
  const crossChapterPattern = /^([\uac00-\ud7af]+)\s+(\d+):(\d+)-(\d+):(\d+)$/;

  let match = normalized.match(singleVersePattern);
  if (match) {
    const [, bookName, chapter, verse] = match;
    const book = findBookByName(bookName);
    if (!book) return null;
    return {
      bookId: book.id,
      bookName: book.name,
      chapterNumber: parseInt(chapter, 10),
      startVerse: parseInt(verse, 10),
      endVerse: null,
      rawText: input,
    };
  }

  match = normalized.match(rangePattern);
  if (match) {
    const [, bookName, chapter, startVerse, endVerse] = match;
    const book = findBookByName(bookName);
    if (!book) return null;
    return {
      bookId: book.id,
      bookName: book.name,
      chapterNumber: parseInt(chapter, 10),
      startVerse: parseInt(startVerse, 10),
      endVerse: parseInt(endVerse, 10),
      rawText: input,
    };
  }

  match = normalized.match(crossChapterPattern);
  if (match) {
    const [, bookName, startChapter, startVerse, endChapter, endVerse] = match;
    const book = findBookByName(bookName);
    if (!book) return null;
    return {
      bookId: book.id,
      bookName: book.name,
      chapterNumber: parseInt(startChapter, 10),
      startVerse: parseInt(startVerse, 10),
      endVerse: parseInt(endVerse, 10),
      rawText: input,
    };
  }

  return null;
}

export function generateBibleReferenceText(ref: BibleReference): string {
  if (ref.endVerse === null) {
    return `${ref.bookName} ${ref.chapterNumber}:${ref.startVerse}`;
  }
  if (ref.endVerse > ref.startVerse) {
    return `${ref.bookName} ${ref.chapterNumber}:${ref.startVerse}-${ref.endVerse}`;
  }
  return `${ref.bookName} ${ref.chapterNumber}:${ref.startVerse}`;
}
