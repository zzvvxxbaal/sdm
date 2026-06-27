export type QTVisibility = "private" | "cell" | "team" | "church" | "leaders" | "admin";

export interface QTEntry {
  id: string;
  userId: string;
  userName: string;
  bibleReference: {
    bookId: string;
    bookName: string;
    chapterNumber: number;
    startVerse: number;
    endVerse: number | null;
  };
  title: string;
  meditation: string;
  prayer: string;
  application: string;
  tags: string[];
  emotion: string | null;
  visibility: QTVisibility;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QTTemplate {
  id: string;
  name: string;
  fields: QTTemplateField[];
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface QTTemplateField {
  id: string;
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "tags";
  placeholder: string | null;
  required: boolean;
  order: number;
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

export interface TodaysQT {
  id: string;
  date: string;
  bibleReference: {
    bookId: string;
    bookName: string;
    chapterNumber: number;
    startVerse: number;
    endVerse: number | null;
  };
  title: string;
  description: string | null;
  createdBy: string;
  createdAt: string;
}
