import Link from "next/link";
import { Sunrise, ChevronRight } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { SectionError } from "./SectionError";
import { EmptyState } from "@/components/ui";
import { parseReference } from "@/services/bible/bibleService";
import type { TodaysQtPassage } from "@/models/daily_content";

export function TodaysQtCard({
  qt,
  error = false,
}: {
  qt: TodaysQtPassage | null;
  error?: boolean;
}) {
  const reference = qt ? parseReference(qt.reference) : null;
  const href = reference
    ? `/bible?book=${reference.bookId}&chapter=${reference.chapterNumber}&verse=${reference.startVerse}`
    : "/bible";

  return (
    <SectionCard title="오늘의 QT">
      {error ? (
        <SectionError message="오늘의 QT를 불러오지 못했습니다" />
      ) : qt ? (
        <Link
          href={href}
          className="flex items-center gap-3 rounded-xl border border-[#e5e5e5] bg-[#fafafa] p-4 transition-colors hover:bg-[#f5f5f5] dark:border-[#2c2c2e] dark:bg-[#262626] dark:hover:bg-[#2c2c2e]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
            <Sunrise className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#171717] dark:text-[#f5f5f5]">
              {qt.title}
            </p>
            <p className="mt-0.5 truncate text-xs text-[#737373] dark:text-[#a3a3a3]">
              {qt.reference}
              {qt.description ? ` · ${qt.description}` : ""}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-[#a3a3a3]" />
        </Link>
      ) : (
        <EmptyState
          icon={Sunrise}
          title="오늘의 QT가 없습니다"
          description="아직 오늘의 QT 본문이 등록되지 않았습니다."
        />
      )}
    </SectionCard>
  );
}
