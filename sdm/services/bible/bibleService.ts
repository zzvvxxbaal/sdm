import { db } from "@/firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  limit,
} from "firebase/firestore";
import type { BibleVerse, BibleReference } from "@/types/bible";
import { getBookById, getBookByFileAbbreviation } from "@/models/bible_book";

const BIBLE_VERSES_COLLECTION = "bible_verses";

/**
 * Get verses for a specific chapter.
 */
export async function getChapterVerses(
  bookId: string,
  chapterNumber: number
): Promise<BibleVerse[]> {
  const q = query(
    collection(db, BIBLE_VERSES_COLLECTION),
    where("bookId", "==", bookId),
    where("chapterNumber", "==", chapterNumber),
    orderBy("verseNumber", "asc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as BibleVerse);
}

/**
 * Get a single verse by ID.
 */
export async function getVerseById(verseId: string): Promise<BibleVerse | null> {
  const docRef = doc(db, BIBLE_VERSES_COLLECTION, verseId);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? (snapshot.data() as BibleVerse) : null;
}

/**
 * Get multiple verses by reference.
 */
export async function getVersesByReference(
  ref: BibleReference
): Promise<BibleVerse[]> {
  const q = query(
    collection(db, BIBLE_VERSES_COLLECTION),
    where("bookId", "==", ref.bookId),
    where("chapterNumber", "==", ref.chapterNumber),
    where("verseNumber", ">=", ref.startVerse),
    where("verseNumber", "<=", ref.endVerse || ref.startVerse),
    orderBy("verseNumber", "asc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as BibleVerse);
}

/**
 * Search verses by keyword (client-side search for now).
 * For production, consider Algolia or Firestore full-text search extensions.
 */
export async function searchVerses(
  keyword: string,
  options?: {
    bookId?: string;
    testament?: "old" | "new";
    limit?: number;
  }
): Promise<BibleVerse[]> {
  // For a 31K verse dataset, we can load all verses into memory
  // or use a Firestore search extension. For now, we'll query by book
  // if specified, otherwise load all verses.

  const q = options?.bookId
    ? query(
        collection(db, BIBLE_VERSES_COLLECTION),
        where("bookId", "==", options.bookId),
        orderBy("verseNumber", "asc")
      )
    : query(
        collection(db, BIBLE_VERSES_COLLECTION),
        orderBy("verseNumber", "asc"),
        limit(options?.limit || 100)
      );

  const snapshot = await getDocs(q);
  const verses = snapshot.docs.map((d) => d.data() as BibleVerse);

  const normalizedKeyword = keyword.toLowerCase().trim();
  return verses.filter(
    (v) =>
      v.text.toLowerCase().includes(normalizedKeyword) ||
      v.bookName.toLowerCase().includes(normalizedKeyword)
  );
}

/**
 * Get today's verse based on the date.
 * All users get the same verse each day.
 */
export function getTodaysVerse(verses: BibleVerse[]): BibleVerse {
  const today = new Date();
  const dayOfYear = getDayOfYear(today);
  const index = dayOfYear % verses.length;
  return verses[index];
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Parse a Bible reference string.
 */
export function parseReference(input: string): BibleReference | null {
  const trimmed = input.trim().replace(/\s+/g, " ");

  // Pattern: "{bookAbbreviation}{chapter}:{verse}"
  const tightPattern = /^([\uac00-\ud7a3]+)(\d+):(\d+)$/;
  const spacedPattern = /^([\uac00-\ud7a3]+)\s+(\d+):(\d+)$/;
  const rangePattern = /^([\uac00-\ud7a3]+)(\d+):(\d+)-(\d+)$/;
  const crossChapterPattern = /^([\uac00-\ud7a3]+)(\d+):(\d+)-(\d+):(\d+)$/;

  let match = trimmed.match(tightPattern);
  if (!match) match = trimmed.match(spacedPattern);

  if (match) {
    const [, bookName, chapter, verse] = match;
    const book = getBookByFileAbbreviation(bookName);
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

  match = trimmed.match(rangePattern);
  if (match) {
    const [, bookName, chapter, startVerse, endVerse] = match;
    const book = getBookByFileAbbreviation(bookName);
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

  match = trimmed.match(crossChapterPattern);
  if (match) {
    const [, bookName, startChapter, startVerse, endChapter, endVerse] = match;
    const book = getBookByFileAbbreviation(bookName);
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

/**
 * Generate a formatted reference string.
 */
export function formatReference(ref: BibleReference): string {
  if (ref.endVerse === null) {
    return `${ref.bookName} ${ref.chapterNumber}:${ref.startVerse}`;
  }
  return `${ref.bookName} ${ref.chapterNumber}:${ref.startVerse}-${ref.endVerse}`;
}
