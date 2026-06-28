import { BibleReferenceLink } from "@/components/bible/BibleReferenceLink";
import { BookOpen } from "lucide-react";
import type { TodaysVerse } from "@/models/daily_content";

export function TodaysVerseCard({
  verse,
  error = false,
}: {
  verse: TodaysVerse | null;
  error?: boolean;
}) {
  const fallback = error
    ? "오늘의 말씀을 불러오지 못했습니다."
    : "오늘의 말씀이 아직 등록되지 않았습니다.";

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] p-6 text-white shadow-[0_8px_30px_-8px_rgba(37,99,235,0.5)]">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
        <BookOpen className="h-3.5 w-3.5" />
        오늘의 말씀
      </div>
      {verse ? (
        <>
          <p className="mt-3 text-[15px] font-medium leading-relaxed">
            {verse.text}
          </p>
          <div className="mt-3 text-sm font-semibold text-white/90">
            — <BibleReferenceLink reference={verse.reference} className="text-white underline-offset-2 hover:underline" />
          </div>
        </>
      ) : (
        <p className="mt-3 text-sm text-white/80">{fallback}</p>
      )}
    </div>
  );
}
