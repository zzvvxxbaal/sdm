import { BIBLE_BOOKS, getBookByFileAbbreviation } from "@/models/bible_book";
import { convertToUTF8 } from "./encoding";
import type { BibleVerse, BibleBook, BibleReference } from "@/types/bible";

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
  stats: ParseStats;
}

export interface ParseStats {
  totalVerses: number;
  totalBooks: number;
  totalChapters: number;
  oldTestamentVerses: number;
  newTestamentVerses: number;
  booksParsed: string[];
}

/**
 * Parses a Korean Bible text file.
 *
 * File format: "{abbreviation}{chapter}:{verse} {text}"
 * Example: "창1:1 태초에 하나님이 천지를 창조하시니라"
 * Example with chapter title: "창1:1 <천지 창조> 태초에 하나님이 천지를 창조하시니라"
 *
 * @param rawText - UTF-8 decoded Bible text
 */
export function parseBibleText(rawText: string): ParsedBibleFile {
  const verses: BibleVerse[] = [];
  const books = new Map<string, ParsedBibleChapter[]>();
  const booksParsed = new Set<string>();
  let oldTestamentVerses = 0;
  let newTestamentVerses = 0;
  let totalChapters = 0;

  const lines = rawText.split("\n").filter((line) => line.trim().length > 0);

  const seenChapters = new Set<string>();

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0) continue;

    // Match: "{abbreviation}{chapter}:{verse} {text}"
    // The abbreviation is 1-3 Korean characters followed immediately by a number
    const refMatch = trimmed.match(/^([\uac00-\ud7a3]+)(\d+):(\d+)\s+(.+)$/);

    if (refMatch) {
      const [, bookAbbreviation, chapterStr, verseStr, text] = refMatch;
      const chapterNumber = parseInt(chapterStr, 10);
      const verseNumber = parseInt(verseStr, 10);

      const book = getBookByFileAbbreviation(bookAbbreviation);
      if (book) {
        booksParsed.add(book.name);

        // Clean chapter titles: "<천지 창조>" → remove angle brackets
        const cleanedText = text.replace(/<[^>]+>\s*/, "").trim();

        const verse: BibleVerse = {
          id: `${book.id}_${chapterNumber}_${verseNumber}`,
          bookId: book.id,
          bookName: book.name,
          chapterNumber,
          verseNumber,
          text: cleanedText,
          testament: book.testament,
        };

        verses.push(verse);
        addVerseToChapterMap(books, verse);

        if (book.testament === "old") {
          oldTestamentVerses++;
        } else {
          newTestamentVerses++;
        }

        const chapterKey = `${book.id}_${chapterNumber}`;
        if (!seenChapters.has(chapterKey)) {
          seenChapters.add(chapterKey);
          totalChapters++;
        }
      }
    }
  }

  const stats: ParseStats = {
    totalVerses: verses.length,
    totalBooks: booksParsed.size,
    totalChapters,
    oldTestamentVerses,
    newTestamentVerses,
    booksParsed: Array.from(booksParsed),
  };

  return { books, verses, stats };
}

/**
 * Parses a Bible text file from a raw buffer.
 * Automatically detects encoding (UTF-8, CP949, EUC-KR).
 */
export function parseBibleBuffer(buffer: Buffer): ParsedBibleFile {
  const text = convertToUTF8(buffer);
  return parseBibleText(text);
}

function addVerseToChapterMap(
  books: Map<string, ParsedBibleChapter[]>,
  verse: BibleVerse
): void {
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

/**
 * Parses a Bible reference string.
 *
 * Supported formats:
 * - "창1:1"
 * - "창 1:1"
 * - "창1:1-3"
 * - "창1:1-2:3"
 * - "창세기 1:1"
 * - "Genesis 1:1" (English aliases)
 */
export function parseBibleReference(input: string): BibleReference | null {
  const normalized = input.trim().replace(/\s+/g, " ");

  // Pattern: "{bookAbbreviation}{chapter}:{verse}"
  const tightPattern = /^([\uac00-\ud7a3]+)(\d+):(\d+)$/;

  // Pattern: "{book} {chapter}:{verse}"
  const spacedPattern = /^([\uac00-\ud7a3]+)\s+(\d+):(\d+)$/;

  // Pattern: "{book}{chapter}:{verse}-{endVerse}"
  const rangePattern = /^([\uac00-\ud7a3]+)(\d+):(\d+)-(\d+)$/;

  // Pattern: "{book}{chapter}:{verse}-{endChapter}:{endVerse}"
  const crossChapterPattern = /^([\uac00-\ud7a3]+)(\d+):(\d+)-(\d+):(\d+)$/;

  let match = normalized.match(tightPattern);
  if (!match) match = normalized.match(spacedPattern);

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
    const [, bookName, startChapter, startVerse, , endVerse] = match;
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

function findBookByName(name: string): BibleBook | undefined {
  return (
    getBookByFileAbbreviation(name) ||
    BIBLE_BOOKS.find((b) => b.name === name || b.shortName === name || b.aliases.includes(name.toLowerCase()))
  );
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

/**
 * Get all verses for a specific chapter.
 */
export function getVersesForChapter(
  verses: BibleVerse[],
  bookId: string,
  chapterNumber: number
): BibleVerse[] {
  return verses
    .filter((v) => v.bookId === bookId && v.chapterNumber === chapterNumber)
    .sort((a, b) => a.verseNumber - b.verseNumber);
}

/**
 * Get all verses for a specific book.
 */
export function getVersesForBook(verses: BibleVerse[], bookId: string): BibleVerse[] {
  return verses.filter((v) => v.bookId === bookId).sort((a, b) => {
    if (a.chapterNumber !== b.chapterNumber) {
      return a.chapterNumber - b.chapterNumber;
    }
    return a.verseNumber - b.verseNumber;
  });
}

/**
 * Get a specific verse.
 */
export function getVerse(
  verses: BibleVerse[],
  bookId: string,
  chapterNumber: number,
  verseNumber: number
): BibleVerse | undefined {
  return verses.find(
    (v) =>
      v.bookId === bookId &&
      v.chapterNumber === chapterNumber &&
      v.verseNumber === verseNumber
  );
}
