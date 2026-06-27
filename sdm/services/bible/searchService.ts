/**
 * Bible Search Service
 * Provides fast keyword and reference search across Bible verses.
 */

import { db } from "@/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAt,
  endAt,
} from "firebase/firestore";
import type { BibleVerse, BibleSearchResult } from "@/types/bible";

const BIBLE_VERSES_COLLECTION = "bible_verses";

/**
 * Search verses by keyword using Firestore queries.
 * For production scale, consider using Algolia or Meilisearch.
 */
export async function searchBibleByKeyword(
  keyword: string,
  options: {
    bookId?: string;
    testament?: "old" | "new";
    limit?: number;
  } = {}
): Promise<BibleSearchResult[]> {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) return [];

  let q = query(collection(db, BIBLE_VERSES_COLLECTION));

  if (options.bookId) {
    q = query(q, where("bookId", "==", options.bookId));
  }

  if (options.testament) {
    q = query(q, where("testament", "==", options.testament));
  }

  q = query(
    q,
    orderBy("searchText"),
    startAt(normalizedKeyword),
    endAt(normalizedKeyword + "\uf8ff"),
    limit(options.limit || 50)
  );

  const snapshot = await getDocs(q);
  const results: BibleSearchResult[] = [];

  snapshot.forEach((doc) => {
    const verse = doc.data() as BibleVerse;
    results.push({
      verse,
      highlightedText: verse.text,
      matchScore: calculateMatchScore(verse.text, keyword),
    });
  });

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Quick search for instant results (limit 10).
 */
export async function quickSearch(keyword: string): Promise<BibleSearchResult[]> {
  return searchBibleByKeyword(keyword, { limit: 10 });
}

/**
 * Calculate match score based on relevance.
 */
function calculateMatchScore(text: string, keyword: string): number {
  const normalizedText = text.toLowerCase();
  const normalizedKeyword = keyword.toLowerCase();

  let score = 0;

  if (normalizedText.startsWith(normalizedKeyword)) {
    score += 10;
  }

  const occurrences = (normalizedText.match(new RegExp(normalizedKeyword, "g")) || []).length;
  score += occurrences * 2;

  const wordRegex = new RegExp(`\\b${normalizedKeyword}\\b`, "g");
  const wordMatches = (normalizedText.match(wordRegex) || []).length;
  score += wordMatches * 5;

  return score;
}
