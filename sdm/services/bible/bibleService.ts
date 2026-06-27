import type { BibleReference, BibleSearchResult, BibleVerse } from "@/types/bible";
import { BIBLE_BOOKS, getBookById, searchBooks } from "@/models/bible_book";
import { normalizeSearchText } from "@/lib/text/searchTokens";

interface BiblePayload {
  verses: BibleVerse[];
}

interface BibleIndex {
  verses: BibleVerse[];
  byId: Map<string, BibleVerse>;
  byChapter: Map<string, BibleVerse[]>;
  ngramIndex: Map<string, string[]>;
}

let cache: Promise<BibleIndex> | null = null;

function normalize(value: string) {
  return normalizeSearchText(value);
}

function chapterKey(bookId: string, chapterNumber: number) {
  return `${bookId}:${chapterNumber}`;
}

function buildNgrams(value: string) {
  const source = normalize(value);
  if (!source) return [];
  if (source.length === 1) return [source];
  const grams = new Set<string>();
  for (let size = 2; size <= Math.min(3, source.length); size += 1) {
    for (let index = 0; index <= source.length - size; index += 1) {
      grams.add(source.slice(index, index + size));
    }
  }
  return [...grams];
}

async function loadBibleData() {
  const response = await fetch("/data/bible_parsed.json");
  const payload = (await response.json()) as BiblePayload;
  return payload.verses;
}

async function getBibleIndex() {
  if (!cache) {
    cache = loadBibleData().then((verses) => {
      const byId = new Map<string, BibleVerse>();
      const byChapter = new Map<string, BibleVerse[]>();
      const rawNgrams = new Map<string, Set<string>>();
      verses.forEach((verse) => {
        byId.set(verse.id, verse);
        const key = chapterKey(verse.bookId, verse.chapterNumber);
        byChapter.set(key, [...(byChapter.get(key) ?? []), verse]);
        buildNgrams(`${verse.bookName}${verse.chapterNumber}${verse.verseNumber}${verse.text}`).forEach(
          (gram) => {
            const ids = rawNgrams.get(gram) ?? new Set<string>();
            ids.add(verse.id);
            rawNgrams.set(gram, ids);
          },
        );
      });
      const ngramIndex = new Map<string, string[]>();
      rawNgrams.forEach((ids, gram) => {
        ngramIndex.set(gram, [...ids]);
      });
      return { verses, byId, byChapter, ngramIndex } satisfies BibleIndex;
    });
  }
  return cache;
}

function scoreVerse(verse: BibleVerse, query: string) {
  const normalized = normalize(query);
  const haystack = normalize(`${verse.bookName}${verse.chapterNumber}${verse.verseNumber}${verse.text}`);
  let score = haystack.includes(normalized) ? 10 : 0;
  if (haystack.startsWith(normalized)) score += 5;
  if (normalize(verse.bookName).includes(normalized)) score += 15;
  return score;
}

export function parseReference(input: string): BibleReference | null {
  const trimmed = input.trim().replace(/\s+/g, " ");
  const match = trimmed.match(/^([0-9a-zA-Z\u3131-\u318e\uac00-\ud7a3]+)\s*(\d+)(?::(\d+)(?:-(\d+))?)?$/);
  if (!match) return null;
  const [, rawBook, rawChapter, rawStartVerse, rawEndVerse] = match;
  const normalizedBook = rawBook.toLowerCase();
  const book =
    BIBLE_BOOKS.find((item) =>
      [item.abbreviation, item.name, item.shortName, item.id, ...item.aliases]
        .map((value) => value.toLowerCase())
        .includes(normalizedBook),
    ) ?? null;
  if (!book) return null;
  return {
    bookId: book.id,
    bookName: book.name,
    chapterNumber: Number(rawChapter),
    startVerse: rawStartVerse ? Number(rawStartVerse) : 1,
    endVerse: rawEndVerse ? Number(rawEndVerse) : null,
    rawText: input,
  };
}

export function formatReference(reference: BibleReference) {
  if (reference.endVerse) {
    return `${reference.bookName} ${reference.chapterNumber}:${reference.startVerse}-${reference.endVerse}`;
  }
  if (reference.startVerse > 1 || reference.rawText.includes(":")) {
    return `${reference.bookName} ${reference.chapterNumber}:${reference.startVerse}`;
  }
  return `${reference.bookName} ${reference.chapterNumber}장`;
}

export async function getChapterVerses(bookId: string, chapterNumber: number) {
  const index = await getBibleIndex();
  return index.byChapter.get(chapterKey(bookId, chapterNumber)) ?? [];
}

export async function getVerseById(verseId: string) {
  const index = await getBibleIndex();
  return index.byId.get(verseId) ?? null;
}

export async function getVersesByReference(reference: BibleReference) {
  const verses = await getChapterVerses(reference.bookId, reference.chapterNumber);
  const endVerse = reference.endVerse ?? reference.startVerse;
  return verses.filter((verse) => verse.verseNumber >= reference.startVerse && verse.verseNumber <= endVerse);
}

function highlightText(text: string, keyword: string) {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${escaped})`, "gi"), "<mark>$1</mark>");
}

export async function searchBible(query: string, limit = 50): Promise<BibleSearchResult[]> {
  const keyword = query.trim();
  if (!keyword) return [];
  const reference = parseReference(keyword);
  if (reference) {
    return (await getVersesByReference(reference)).map((verse) => ({
      verse,
      highlightedText: verse.text,
      matchScore: 100,
    }));
  }

  const index = await getBibleIndex();
  const grams = buildNgrams(keyword);
  const candidateIds = grams.reduce<string[] | null>((acc, gram) => {
    const ids = index.ngramIndex.get(gram) ?? [];
    if (acc === null) return ids;
    return acc.filter((id) => ids.includes(id));
  }, null);
  const verseMatches = (candidateIds ?? [])
    .map((id) => index.byId.get(id))
    .filter((verse): verse is BibleVerse => Boolean(verse))
    .filter((verse) => normalize(`${verse.bookName}${verse.chapterNumber}${verse.verseNumber}${verse.text}`).includes(normalize(keyword)))
    .map((verse) => ({
      verse,
      highlightedText: highlightText(verse.text, keyword),
      matchScore: scoreVerse(verse, keyword),
    }));

  const bookMatches = await Promise.all(
    searchBooks(keyword).map(async (book) => {
      const firstVerse = (await getChapterVerses(book.id, 1))[0];
      return firstVerse
        ? {
            verse: firstVerse,
            highlightedText: `${book.name} 1장으로 이동`,
            matchScore: 80,
          }
        : null;
    }),
  );

  return [...verseMatches, ...bookMatches.filter((item): item is BibleSearchResult => Boolean(item))]
    .sort((left, right) => right.matchScore - left.matchScore)
    .slice(0, limit);
}

export async function getResolvedReference(input: string) {
  const reference = parseReference(input);
  if (!reference) return null;
  const book = getBookById(reference.bookId);
  if (!book || reference.chapterNumber > book.chapterCount) return null;
  return reference;
}
