import { addDays, endOfWeek, format, startOfWeek } from "date-fns";
import type { QTCalendarDay, QTEntry, QTMonthlySummary, QTQueryFilters, QTWeeklySummary } from "@/types/qt";
import { splitSearchTokens } from "@/lib/text/searchTokens";

interface SearchTokenSource {
  title: string;
  meditation: string;
  prayer: string;
  application: string;
  tags: string[];
  bibleReference: QTEntry["bibleReference"];
}

export function normalizeDateKey(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return format(date, "yyyy-MM-dd");
}

export function getMonthKey(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return format(date, "yyyy-MM");
}

export function toDate(value: unknown) {
  if (typeof value === "string") return new Date(value);
  if (value && typeof value === "object") {
    const record = value as { toDate?: () => Date; seconds?: number };
    if (typeof record.toDate === "function") return record.toDate();
    if (typeof record.seconds === "number") return new Date(record.seconds * 1000);
  }
  return null;
}

function parseDateKey(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`);
}

export function buildSearchTokens(entry: SearchTokenSource) {
  const source = [
    entry.title,
    entry.meditation,
    entry.prayer,
    entry.application,
    entry.bibleReference.bookName,
    entry.bibleReference.bookId,
    ...entry.tags,
  ]
    .join(" ")
    .toLowerCase();
  const tokens = source
    .split(" ")
    .flatMap((value) => splitSearchTokens(value));
  return [...new Set(tokens)];
}

export function filterEntries(entries: QTEntry[], filters: QTQueryFilters) {
  const search = filters.search?.trim().toLowerCase();
  return entries.filter((entry) => {
    if (filters.dateKey && entry.dateKey !== filters.dateKey) return false;
    if (filters.tag && !entry.tags.includes(filters.tag)) return false;
    if (filters.bookId && entry.bibleReference.bookId !== filters.bookId) return false;
    if (filters.visibility && filters.visibility !== "all" && entry.visibility !== filters.visibility) return false;
    if (filters.favoriteOnly && !entry.isFavorite) return false;
    if (filters.archivedOnly && !entry.isArchived) return false;
    if (!search) return true;
    const haystack = [entry.title, entry.meditation, entry.prayer, entry.application, entry.bibleReference.bookName, ...entry.tags].join(" ").toLowerCase();
    return haystack.includes(search);
  });
}

function getUniqueDayKeys(entries: QTEntry[]) {
  return [...new Set(entries.map((entry) => entry.dateKey))].sort();
}

export function computeCurrentStreak(entries: QTEntry[], today = new Date()) {
  const keys = new Set(getUniqueDayKeys(entries));
  let cursor = new Date(today);
  if (!keys.has(normalizeDateKey(cursor))) cursor = addDays(cursor, -1);
  let streak = 0;
  while (keys.has(normalizeDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function computeLongestStreak(entries: QTEntry[]) {
  const keys = getUniqueDayKeys(entries);
  let longest = 0;
  let current = 0;
  let previous: Date | null = null;
  keys.forEach((key) => {
    const date = parseDateKey(key);
    if (previous && normalizeDateKey(addDays(previous, 1)) === key) current += 1;
    else current = 1;
    previous = date;
    longest = Math.max(longest, current);
  });
  return longest;
}

function countMap(values: string[]) {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

export function buildWeeklySummary(entries: QTEntry[], anchorDate: Date) {
  const weekStart = startOfWeek(anchorDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(anchorDate, { weekStartsOn: 1 });
  const rangeEntries = entries.filter((entry) => {
    const date = parseDateKey(entry.dateKey);
    return date >= weekStart && date <= weekEnd;
  });
  return {
    weekStart: normalizeDateKey(weekStart),
    weekEnd: normalizeDateKey(weekEnd),
    totalEntries: rangeEntries.length,
    favoriteCount: rangeEntries.filter((entry) => entry.isFavorite).length,
    streakDays: computeCurrentStreak(rangeEntries, weekEnd),
    emotions: countMap(rangeEntries.map((entry) => entry.emotion).filter((value): value is string => Boolean(value))),
    topTags: Object.entries(countMap(rangeEntries.flatMap((entry) => entry.tags)))
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5)
      .map(([tag]) => tag),
  } satisfies QTWeeklySummary;
}

export function buildMonthlySummary(entries: QTEntry[], year: number, month: number) {
  const daysInMonth = new Date(year, month, 0).getDate();
  return {
    year,
    month,
    totalEntries: entries.length,
    completionRate: Math.round((getUniqueDayKeys(entries).length / daysInMonth) * 100),
    streakDays: computeCurrentStreak(entries),
    longestStreak: computeLongestStreak(entries),
    emotions: countMap(entries.map((entry) => entry.emotion).filter((value): value is string => Boolean(value))),
    topTags: Object.entries(countMap(entries.flatMap((entry) => entry.tags))).sort((left, right) => right[1] - left[1]).slice(0, 5).map(([tag]) => tag),
    topBooks: Object.entries(countMap(entries.map((entry) => entry.bibleReference.bookName))).sort((left, right) => right[1] - left[1]).slice(0, 5).map(([book]) => book),
  } satisfies QTMonthlySummary;
}

export function buildCalendarDays(entries: QTEntry[], year: number, month: number) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const map = new Map(entries.map((entry) => [entry.dateKey, entry]));
  return Array.from({ length: daysInMonth }, (_, index) => {
    const date = format(new Date(year, month - 1, index + 1), "yyyy-MM-dd");
    const entry = map.get(date);
    return {
      date,
      hasQT: Boolean(entry),
      isFavorite: Boolean(entry?.isFavorite),
      isArchived: Boolean(entry?.isArchived),
      emotion: entry?.emotion ?? null,
    } satisfies QTCalendarDay;
  });
}
