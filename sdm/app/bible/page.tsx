"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, History, Search } from "lucide-react";
import { BookSelector, ChapterViewer, BibleSearch, VerseCard } from "@/features/bible";
import { useBibleReader } from "@/features/bible/hooks/useBibleReader";
import { useBibleSearch } from "@/features/bible/hooks/useBibleSearch";
import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";
import { listBibleFavorites, listBibleHistory, recordBibleHistory } from "@/services/bible/userBibleService";

type ViewMode = "reader" | "search";

export default function BiblePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>(searchParams.get("q") ? "search" : "reader");
  const [favorites, setFavorites] = useState<Array<{ id: string; verseId: string; bookName: string; chapterNumber: number; verseNumber: number; text: string }>>([]);
  const [history, setHistory] = useState<Array<{ id: string; verseId: string; bookName: string; chapterNumber: number; verseNumber: number }>>([]);
  const { bookId, chapterNumber, verses, book, loading, goToChapter, goToReference, goToNextChapter, goToPreviousChapter } = useBibleReader(
    searchParams.get("book") ?? "gen",
    Number(searchParams.get("chapter") ?? 1),
  );
  const { query, setQuery, results, loading: searchLoading, search, clear } = useBibleSearch();

  useEffect(() => {
    const rawReference = searchParams.get("ref");
    if (rawReference) void goToReference(rawReference);
  }, [goToReference, searchParams]);

  useEffect(() => {
    const rawQuery = searchParams.get("q");
    if (!rawQuery) return;
    setQuery(rawQuery);
    void search(rawQuery);
  }, [search, searchParams, setQuery]);

  useEffect(() => {
    const firstVerse = verses[0];
    if (!user || !firstVerse) return;
    void recordBibleHistory(user.uid, firstVerse);
  }, [user, verses]);

  useEffect(() => {
    if (!user) return;
    void Promise.all([listBibleFavorites(user.uid), listBibleHistory(user.uid)]).then(([nextFavorites, nextHistory]) => {
      setFavorites(nextFavorites as typeof favorites);
      setHistory(nextHistory as typeof history);
    });
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("book", bookId);
    params.set("chapter", String(chapterNumber));
    router.replace(`/bible?${params.toString()}`);
  }, [bookId, chapterNumber, router, searchParams]);

  const historyItems = useMemo(() => history.slice(0, 5), [history]);

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-4 dark:bg-[#0a0a0a]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-3xl border border-[#e5e5e5] bg-white dark:border-[#2c2c2e] dark:bg-[#121212]">
          <div className="flex items-center gap-3 border-b border-[#e5e5e5] p-4 dark:border-[#2c2c2e]">
            <BookSelector currentBookId={bookId} currentChapter={chapterNumber} onSelect={goToChapter} />
            <div className="ml-auto flex rounded-xl bg-[#f5f5f5] p-1 dark:bg-[#262626]">
              {(["reader", "search"] as ViewMode[]).map((mode) => (
                <button key={mode} onClick={() => setViewMode(mode)} className={cn("rounded-lg px-3 py-1.5 text-sm font-semibold", viewMode === mode ? "bg-white text-[#2563EB] dark:bg-[#1c1c1e]" : "text-[#737373]")}>{mode === "reader" ? "읽기" : "검색"}</button>
              ))}
            </div>
          </div>
          {viewMode === "reader" ? (
            loading ? (
              <div className="flex h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e5e5e5] border-t-[#2563EB]" /></div>
            ) : (
              <ChapterViewer book={book} chapterNumber={chapterNumber} verses={verses} onPrevious={goToPreviousChapter} onNext={goToNextChapter} />
            )
          ) : (
            <div className="p-4">
              <BibleSearch query={query} onQueryChange={setQuery} results={results} loading={searchLoading} onSearch={search} onClear={clear} onSelectVerse={(verseId) => {
                const [nextBookId, nextChapter] = verseId.split("_");
                goToChapter(nextBookId, Number(nextChapter));
                setViewMode("reader");
              }} />
              <div className="mt-4 space-y-3">
                {results.map((result) => <VerseCard key={result.verse.id} verse={result.verse} />)}
                {!results.length && query.trim() && !searchLoading && <p className="py-10 text-center text-sm text-[#a3a3a3]">검색 결과가 없습니다.</p>}
              </div>
            </div>
          )}
        </div>
        <aside className="space-y-4">
          <Panel title="최근 본 본문" icon={<History className="h-4 w-4" />}>
            {historyItems.length ? historyItems.map((item) => (
              <button key={item.id} onClick={() => goToChapter(item.verseId.split("_")[0], item.chapterNumber)} className="w-full rounded-xl border border-[#e5e5e5] p-3 text-left text-sm hover:bg-[#fafafa] dark:border-[#2c2c2e] dark:hover:bg-[#1c1c1e]">
                <p className="font-semibold text-[#171717] dark:text-[#f5f5f5]">{item.bookName} {item.chapterNumber}:{item.verseNumber}</p>
              </button>
            )) : <Empty label="최근 기록이 없습니다" />}
          </Panel>
          <Panel title="즐겨찾기" icon={<BookOpen className="h-4 w-4" />}>
            {favorites.length ? favorites.slice(0, 5).map((item) => (
              <button key={item.id} onClick={() => goToChapter(item.verseId.split("_")[0], item.chapterNumber)} className="w-full rounded-xl border border-[#e5e5e5] p-3 text-left text-sm hover:bg-[#fafafa] dark:border-[#2c2c2e] dark:hover:bg-[#1c1c1e]">
                <p className="font-semibold text-[#171717] dark:text-[#f5f5f5]">{item.bookName} {item.chapterNumber}:{item.verseNumber}</p>
                <p className="mt-1 line-clamp-2 text-xs text-[#737373] dark:text-[#a3a3a3]">{item.text}</p>
              </button>
            )) : <Empty label="저장한 구절이 없습니다" />}
          </Panel>
          <Panel title="빠른 검색" icon={<Search className="h-4 w-4" />}>
            <div className="flex flex-wrap gap-2">
              {["사랑", "요 3:16", "시 23:1", "창 1:1"].map((preset) => (
                <button key={preset} onClick={() => { setViewMode("search"); setQuery(preset); void search(preset); }} className="rounded-full bg-[#eff6ff] px-3 py-1.5 text-xs font-semibold text-[#2563EB]">{preset}</button>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-[#e5e5e5] bg-white p-4 dark:border-[#2c2c2e] dark:bg-[#121212]"><div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#171717] dark:text-[#f5f5f5]">{icon}{title}</div>{children}</section>;
}

function Empty({ label }: { label: string }) {
  return <p className="rounded-xl bg-[#fafafa] px-4 py-6 text-center text-sm text-[#a3a3a3] dark:bg-[#1c1c1e]">{label}</p>;
}
