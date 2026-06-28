"use client";

import { useQT } from "@/hooks/useQT";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { QTEditor, QTList } from "@/components/qt";
import { Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { QTEntryInput } from "@/types/qt";

export default function QtPage() {
  const { isAuthenticated } = useAuth();
  const { entries, todayQT, loading, error, createQT, deleteQT } = useQT();

  const handleSubmit = async (data: QTEntryInput) => {
    await createQT(data);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-120px)] px-4">
        <p className="text-[#737373] dark:text-[#a3a3a3]">로그인이 필요합니다</p>
      </div>
    );
  }

  const today = new Date();
  const todayStr = format(today, "M월 d일 (EEE)", { locale: ko });

  return (
    <div className="min-h-[calc(100dvh-120px)] bg-[#f8fafc] dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-lg space-y-6 px-4 py-6 pb-24">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-[#171717] dark:text-[#f5f5f5]">
            오늘의 QT
          </h1>
          <p className="text-xs text-[#737373] dark:text-[#a3a3a3] mt-1">
            {todayStr}
          </p>
        </div>

        {/* Today's QT Status */}
        {todayQT ? (
          <div className="rounded-xl border border-[#e5e5e5] bg-white p-4 dark:bg-[#1c1c1e] dark:border-[#2c2c2e]">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-[#2563EB]" />
              <p className="text-sm font-semibold text-[#2563EB]">
                오늘의 QT가 저장되었습니다
              </p>
            </div>
            <p className="text-sm text-[#525252] dark:text-[#d1d1d1]">
              {todayQT.title}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-[#e5e5e5] bg-white p-4 dark:bg-[#1c1c1e] dark:border-[#2c2c2e]">
            <p className="text-sm text-[#737373] dark:text-[#a3a3a3]">
              아직 오늘의 QT를 작성하지 않았습니다
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="rounded-xl border border-[#FECACA] bg-[#FEE2E2] px-4 py-3">
            <p className="text-sm text-[#DC2626]">
              {error.message}
            </p>
          </div>
        )}

        {/* QT Editor Section */}
        <div>
          <h2 className="text-lg font-bold text-[#171717] dark:text-[#f5f5f5] mb-4">
            QT 작성
          </h2>
          <div className="rounded-xl border border-[#e5e5e5] bg-white p-4 dark:bg-[#1c1c1e] dark:border-[#2c2c2e]">
            <QTEditor onSubmit={handleSubmit} isLoading={loading} />
          </div>
        </div>

        {/* QT History Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-[#2563EB]" />
            <h2 className="text-lg font-bold text-[#171717] dark:text-[#f5f5f5]">
              QT 이력
            </h2>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-[#2563EB]" />
            </div>
          )}

          {!loading && (
            <QTList
              entries={entries}
              onDelete={deleteQT}
              isLoading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
