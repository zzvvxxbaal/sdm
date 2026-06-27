"use client";

import { useMemo, useState } from "react";
import { addMonths, subMonths } from "date-fns";
import { Search } from "lucide-react";
import { useAuth } from "@/features/auth";
import { QTCalendar } from "@/features/qt/components/QTCalendar";
import { QTEntryForm } from "@/features/qt/components/QTEntryForm";
import { QTEntryList } from "@/features/qt/components/QTEntryList";
import { QTSummaryCards } from "@/features/qt/components/QTSummaryCards";
import { useQTDashboard } from "@/features/qt/hooks/useQTDashboard";
import { deleteQTEntry, toggleQTArchive, toggleQTFavorite, createQTEntry, updateQTEntry } from "@/services/qt/qtService";
import { getMonthKey, normalizeDateKey } from "@/features/qt/lib/qt-utils";
import { Button, Field, Input, Select } from "@/components/ui";
import type { QTEntry, QTEntryInput, QTQueryFilters } from "@/types/qt";

const VISIBILITY_OPTIONS = [
  { value: "all", label: "전체 공개 범위" },
  { value: "private", label: "비공개" },
  { value: "cell", label: "셀" },
  { value: "team", label: "팀" },
  { value: "church", label: "교회" },
  { value: "leaders", label: "리더" },
  { value: "admin", label: "관리자" },
] as const;

export default function QtPage() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(normalizeDateKey(new Date()));
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [bookId, setBookId] = useState("");
  const [visibility, setVisibility] = useState<QTQueryFilters["visibility"]>("all");
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [archivedOnly, setArchivedOnly] = useState(false);
  const [editing, setEditing] = useState<QTEntry | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const filters = useMemo(() => ({ monthKey: getMonthKey(currentMonth), dateKey: selectedDate, search, tag: tag || undefined, bookId: bookId || undefined, visibility, favoriteOnly, archivedOnly }), [archivedOnly, bookId, currentMonth, favoriteOnly, search, selectedDate, tag, visibility]);
  const { entries, calendarDays, monthlySummary, weeklySummary, loading, reload } = useQTDashboard(user?.uid, currentMonth, filters);

  const allTags = useMemo(() => [...new Set(entries.flatMap((entry) => entry.tags))], [entries]);
  const allBooks = useMemo(
    () =>
      Array.from(
        new Map(entries.map((entry) => [entry.bibleReference.bookId, entry.bibleReference])).values(),
      ),
    [entries],
  );

  const saveEntry = async (input: QTEntryInput) => {
    if (!user) return;
    setSubmitting(true);
    try {
      if (editing) await updateQTEntry(editing.id, user, input);
      else await createQTEntry(user, input);
      setEditing(null);
      await reload();
    } finally {
      setSubmitting(false);
    }
  };

  const removeEntry = async (entry: QTEntry) => {
    if (!user) return;
    if (!window.confirm(`\"${entry.title}\" QT를 삭제할까요?`)) return;
    await deleteQTEntry(entry.id, user.uid);
    setEditing(null);
    await reload();
  };

  if (!user) {
    return <div className="px-4 py-10 text-center text-sm text-[#737373]">QT는 로그인 후 사용할 수 있습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-6 dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-6xl space-y-4">
        <QTCalendar currentMonth={currentMonth} selectedDate={selectedDate} days={calendarDays} streakDays={monthlySummary?.streakDays ?? 0} onPreviousMonth={() => setCurrentMonth((value) => subMonths(value, 1))} onNextMonth={() => setCurrentMonth((value) => addMonths(value, 1))} onSelectDate={setSelectedDate} />
        <QTSummaryCards monthly={monthlySummary} weekly={weeklySummary} />
        <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
          <QTEntryForm selectedDate={selectedDate} editing={editing} onSubmit={saveEntry} onCancel={() => setEditing(null)} submitting={submitting} />
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#e5e5e5] bg-white p-4 dark:border-[#2c2c2e] dark:bg-[#1c1c1e]">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <Field label="검색"><div className="relative"><Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#a3a3a3]" /><Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="본문/제목 검색" /></div></Field>
                <Field label="태그"><Select value={tag} onChange={(event) => setTag(event.target.value)}><option value="">전체 태그</option>{allTags.map((item) => <option key={item} value={item}>{item}</option>)}</Select></Field>
                <Field label="성경 책"><Select value={bookId} onChange={(event) => setBookId(event.target.value)}><option value="">전체 책</option>{allBooks.map((item) => <option key={item.bookId} value={item.bookId}>{item.bookName}</option>)}</Select></Field>
                <Field label="공개 범위"><Select value={visibility ?? "all"} onChange={(event) => setVisibility(event.target.value as QTQueryFilters["visibility"])}>{VISIBILITY_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</Select></Field>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" size="sm" variant={favoriteOnly ? "primary" : "secondary"} onClick={() => setFavoriteOnly((value) => !value)}>즐겨찾기만</Button>
                <Button type="button" size="sm" variant={archivedOnly ? "primary" : "secondary"} onClick={() => setArchivedOnly((value) => !value)}>보관함만</Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => { setSearch(""); setTag(""); setBookId(""); setVisibility("all"); setFavoriteOnly(false); setArchivedOnly(false); }}>필터 초기화</Button>
              </div>
            </div>
            {loading ? <div className="rounded-2xl bg-white p-10 text-center text-sm text-[#737373] dark:bg-[#1c1c1e]">QT를 불러오는 중입니다...</div> : <QTEntryList entries={entries} onEdit={setEditing} onDelete={removeEntry} onToggleFavorite={async (entry) => { await toggleQTFavorite(entry.id, entry.isFavorite); await reload(); }} onToggleArchive={async (entry) => { await toggleQTArchive(entry.id, entry.isArchived); await reload(); }} />}
          </div>
        </div>
      </div>
    </div>
  );
}
