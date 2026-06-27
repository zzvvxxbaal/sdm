"use client";

import { useDailyContent } from "@/features/admin/hooks/useDailyContent";
import { TodaysVerseForm, TodaysQtForm } from "@/features/admin/components";
import { PageHeader, FullScreenSpinner } from "@/components/ui";

export default function DailyContentPage() {
  const { verse, qt, isLoading, saveVerse, saveQt } = useDailyContent();

  if (isLoading) return <FullScreenSpinner />;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 px-4 py-6">
      <PageHeader title="오늘의 말씀/QT" description="홈 화면에 노출되는 말씀과 묵상을 설정합니다" />
      <TodaysVerseForm initial={verse} onSave={saveVerse} />
      <TodaysQtForm initial={qt} onSave={saveQt} />
    </div>
  );
}
