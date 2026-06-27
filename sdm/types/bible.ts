export type Testament = "old" | "new";

export interface BibleBook {
  id: string;
  name: string;
  shortName: string;
  testament: Testament;
  order: number;
  chapterCount: number;
  abbreviation: string;
}

export interface BibleChapter {
  id: string;
  bookId: string;
  bookName: string;
  chapterNumber: number;
  verseCount: number;
}

export interface BibleVerse {
  id: string;
  bookId: string;
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  text: string;
  testament: Testament;
  searchText?: string;
}

export interface BibleReference {
  bookId: string;
  bookName: string;
  chapterNumber: number;
  startVerse: number;
  endVerse: number | null;
  rawText: string;
}

export interface BibleSearchResult {
  verse: BibleVerse;
  // Raw text rendered by the UI layer, which applies safe highlighting without HTML injection.
  displayText: string;
  matchScore: number;
}

export interface BibleReadingState {
  currentBookId: string;
  currentChapterNumber: number;
  currentVerseNumber: number | null;
  fontSize: number;
  lineHeight: number;
  theme: "light" | "dark" | "sepia";
}

export interface BibleBookmark {
  id: string;
  userId: string;
  verseId: string;
  bookId: string;
  chapterNumber: number;
  verseNumber: number;
  text: string;
  folderId: string | null;
  note: string | null;
  createdAt: string;
}

export interface BibleBookmarkFolder {
  id: string;
  userId: string;
  name: string;
  color: string;
  order: number;
  createdAt: string;
}

export interface BibleReadingHistory {
  id: string;
  userId: string;
  bookId: string;
  bookName: string;
  chapterNumber: number;
  verseNumber: number | null;
  viewedAt: string;
}

export interface BibleSearchHistory {
  id: string;
  userId: string;
  query: string;
  type: "reference" | "keyword";
  resultCount: number;
  searchedAt: string;
}

export interface TodaysVerse {
  id: string;
  date: string;
  verseId: string;
  bookId: string;
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  text: string;
  theme: string;
  createdBy: string;
  createdAt: string;
}

export interface ReadingPlan {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  type: "30-day" | "90-day" | "one-year" | "custom";
  schedule: ReadingPlanDay[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingPlanDay {
  day: number;
  passages: BibleReference[];
  completed: boolean;
  completedAt: string | null;
}

export interface ReadingProgress {
  userId: string;
  planId: string;
  currentDay: number;
  completedDays: number;
  totalDays: number;
  streak: number;
  longestStreak: number;
  startedAt: string;
  lastReadAt: string;
  isCompleted: boolean;
  completedAt: string | null;
}

export interface BibleTheme {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  verseNumberColor: string;
  primaryColor: string;
  fontFamily: string;
}
