import { Card } from "@/components/ui";
import type { QTMonthlySummary, QTWeeklySummary } from "@/types/qt";

export function QTSummaryCards({ monthly, weekly }: { monthly: QTMonthlySummary | null; weekly: QTWeeklySummary | null }) {
  const monthlyTags = monthly?.topTags.slice(0, 3).join(", ") || "없음";
  const weeklyTags = weekly?.topTags.slice(0, 3).join(", ") || "없음";
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Card className="space-y-2 p-4">
        <p className="text-xs font-semibold text-[#2563EB]">이번 달</p>
        <p className="text-2xl font-bold text-[#171717] dark:text-[#f5f5f5]">{monthly?.totalEntries ?? 0}회</p>
        <p className="text-sm text-[#737373] dark:text-[#a3a3a3]">완료율 {monthly?.completionRate ?? 0}% · 최장 {monthly?.longestStreak ?? 0}일</p>
        <p className="text-xs text-[#a3a3a3]">주요 태그: {monthlyTags}</p>
      </Card>
      <Card className="space-y-2 p-4">
        <p className="text-xs font-semibold text-[#2563EB]">이번 주</p>
        <p className="text-2xl font-bold text-[#171717] dark:text-[#f5f5f5]">{weekly?.totalEntries ?? 0}회</p>
        <p className="text-sm text-[#737373] dark:text-[#a3a3a3]">즐겨찾기 {weekly?.favoriteCount ?? 0}개 · 연속 {weekly?.streakDays ?? 0}일</p>
        <p className="text-xs text-[#a3a3a3]">주요 태그: {weeklyTags}</p>
      </Card>
    </div>
  );
}
