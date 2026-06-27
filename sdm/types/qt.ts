import type { BibleReference } from "@/types/bible";

export type QTVisibility = "private" | "cell" | "team" | "church" | "leaders" | "admin";

export interface QTEntry {
  id: string;
  userId: string;
  userName: string;
  teamId: string | null;
  cellId: string | null;
  entryDate: string;
  dateKey: string;
  monthKey: string;
  bibleReference: BibleReference;
  title: string;
  meditation: string;
  prayer: string;
  application: string;
  tags: string[];
  searchTokens: string[];
  emotion: string | null;
  visibility: QTVisibility;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface QTEntryInput {
  entryDate: string;
  bibleReference: BibleReference;
  title: string;
  meditation: string;
  prayer: string;
  application: string;
  tags: string[];
  emotion: string | null;
  visibility: QTVisibility;
  isFavorite: boolean;
  isArchived: boolean;
}

export interface QTQueryFilters {
  monthKey?: string;
  dateKey?: string;
  tag?: string;
  bookId?: string;
  visibility?: QTVisibility | "all";
  favoriteOnly?: boolean;
  archivedOnly?: boolean;
  search?: string;
  limit?: number;
}

export interface QTCalendarDay {
  date: string;
  hasQT: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  emotion: string | null;
}

export interface QTWeeklySummary {
  weekStart: string;
  weekEnd: string;
  totalEntries: number;
  favoriteCount: number;
  streakDays: number;
  emotions: Record<string, number>;
  topTags: string[];
}

export interface QTMonthlySummary {
  year: number;
  month: number;
  totalEntries: number;
  completionRate: number;
  streakDays: number;
  longestStreak: number;
  emotions: Record<string, number>;
  topTags: string[];
  topBooks: string[];
}
