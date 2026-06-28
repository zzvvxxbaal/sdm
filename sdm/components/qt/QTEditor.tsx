"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Heart, AlertCircle, Loader2 } from "lucide-react";
import type { QTEntryInput } from "@/types/qt";

interface QTEditorProps {
  onSubmit: (data: QTEntryInput) => Promise<void>;
  isLoading?: boolean;
}

export function QTEditor({ onSubmit, isLoading = false }: QTEditorProps) {
  const [title, setTitle] = useState("");
  const [scripture, setScripture] = useState("");
  const [observation, setObservation] = useState("");
  const [application, setApplication] = useState("");
  const [prayer, setPrayer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("제목을 입력해주세요");
      return;
    }

    if (!scripture.trim()) {
      setError("성경 본문을 입력해주세요");
      return;
    }

    setIsSubmitting(true);

    try {
      const today = new Date().toISOString().split("T")[0];

      const data: QTEntryInput = {
        userName: "",
        title: title.trim(),
        bibleReference: {
          bookId: "",
          bookName: scripture.trim().split(" ")[0],
          chapterNumber: 1,
          startVerse: 1,
          endVerse: null,
        },
        meditation: observation.trim(),
        prayer: prayer.trim(),
        application: application.trim(),
        tags: [],
        emotion: null,
        visibility: "private",
        isFavorite: false,
        isArchived: false,
      };

      await onSubmit(data);

      // Reset form
      setTitle("");
      setScripture("");
      setObservation("");
      setApplication("");
      setPrayer("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "QT 저장에 실패했습니다";
      setError(errorMessage);
      console.error("QT submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="text-xs font-semibold text-[#737373] mb-1.5 block">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해주세요 (예: 사랑의 힘)"
          disabled={isSubmitting || isLoading}
          className={cn(
            "w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm",
            "placeholder:text-[#a3a3a3] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#f5f5f5]"
          )}
        />
      </div>

      {/* Scripture Reference */}
      <div>
        <label className="text-xs font-semibold text-[#737373] mb-1.5 block">성경 본문</label>
        <input
          type="text"
          value={scripture}
          onChange={(e) => setScripture(e.target.value)}
          placeholder="성경 본문을 입력해주세요 (예: 창세기 1:1-3)"
          disabled={isSubmitting || isLoading}
          className={cn(
            "w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm",
            "placeholder:text-[#a3a3a3] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#f5f5f5]"
          )}
        />
      </div>

      {/* Observation */}
      <div>
        <label className="text-xs font-semibold text-[#737373] mb-1.5 block">
          관찰 (Observation)
        </label>
        <textarea
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          placeholder="성경 범위에서 뭐라고 말하고 있나요?"
          rows={4}
          disabled={isSubmitting || isLoading}
          className={cn(
            "w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm resize-none",
            "placeholder:text-[#a3a3a3] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#f5f5f5]"
          )}
        />
      </div>

      {/* Application */}
      <div>
        <label className="text-xs font-semibold text-[#737373] mb-1.5 block">
          적용 (Application)
        </label>
        <textarea
          value={application}
          onChange={(e) => setApplication(e.target.value)}
          placeholder="오늘 나의 삶에 어떻게 적용할 수 있나요?"
          rows={4}
          disabled={isSubmitting || isLoading}
          className={cn(
            "w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm resize-none",
            "placeholder:text-[#a3a3a3] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#f5f5f5]"
          )}
        />
      </div>

      {/* Prayer */}
      <div>
        <label className="text-xs font-semibold text-[#737373] mb-1.5 block">기도 (Prayer)</label>
        <textarea
          value={prayer}
          onChange={(e) => setPrayer(e.target.value)}
          placeholder="주님께 드리고 싶은 기도를 작성해주세요"
          rows={4}
          disabled={isSubmitting || isLoading}
          className={cn(
            "w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm resize-none",
            "placeholder:text-[#a3a3a3] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#f5f5f5]"
          )}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-[#FECACA] bg-[#FEE2E2] px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626]" />
          <span className="text-sm text-[#DC2626]">{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className={cn(
          "w-full h-12 rounded-xl bg-[#2563EB] text-white text-sm font-semibold",
          "hover:bg-[#1d4ed8] transition-colors active:scale-[0.98]",
          "disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        )}
      >
        {isSubmitting || isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            저장 중...
          </>
        ) : (
          <>
            <Heart className="h-4 w-4" />
            QT 저장하기
          </>
        )}
      </button>
    </form>
  );
}
      {/* Title */}
      <div>
        <label className="text-xs font-semibold text-[#737373] mb-1.5 block">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해주세요 (예: 사랑의 힘)"
          disabled={isSubmitting || isLoading}
          className={cn(
            "w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm",
            "placeholder:text-[#a3a3a3] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#f5f5f5]"
          )}
        />
      </div>

      {/* Scripture Reference */}
      <div>
        <label className="text-xs font-semibold text-[#737373] mb-1.5 block">성경 본문</label>
        <input
          type="text"
          value={scripture}
          onChange={(e) => setScripture(e.target.value)}
          placeholder="성경 본문을 입력해주세요 (예: 창세기 1:1-3)"
          disabled={isSubmitting || isLoading}
          className={cn(
            "w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm",
            "placeholder:text-[#a3a3a3] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#f5f5f5]"
          )}
        />
      </div>

      {/* Observation */}
      <div>
        <label className="text-xs font-semibold text-[#737373] mb-1.5 block">
          관찰 (Observation)
        </label>
        <textarea
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          placeholder="성경 범위에서 뭐라고 말하고 있나요?"
          rows={4}
          disabled={isSubmitting || isLoading}
          className={cn(
            "w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm resize-none",
            "placeholder:text-[#a3a3a3] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#f5f5f5]"
          )}
        />
      </div>

      {/* Application */}
      <div>
        <label className="text-xs font-semibold text-[#737373] mb-1.5 block">
          적용 (Application)
        </label>
        <textarea
          value={application}
          onChange={(e) => setApplication(e.target.value)}
          placeholder="오늘 나의 삶에 어떻게 적용할 수 있나요?"
          rows={4}
          disabled={isSubmitting || isLoading}
          className={cn(
            "w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm resize-none",
            "placeholder:text-[#a3a3a3] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#f5f5f5]"
          )}
        />
      </div>

      {/* Prayer */}
      <div>
        <label className="text-xs font-semibold text-[#737373] mb-1.5 block">기도 (Prayer)</label>
        <textarea
          value={prayer}
          onChange={(e) => setPrayer(e.target.value)}
          placeholder="주님께 드리고 싶은 기도를 작성해주세요"
          rows={4}
          disabled={isSubmitting || isLoading}
          className={cn(
            "w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm resize-none",
            "placeholder:text-[#a3a3a3] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#f5f5f5]"
          )}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-[#FECACA] bg-[#FEE2E2] px-4 py-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626]" />
          <span className="text-sm text-[#DC2626]">{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className={cn(
          "w-full h-12 rounded-xl bg-[#2563EB] text-white text-sm font-semibold",
          "hover:bg-[#1d4ed8] transition-colors active:scale-[0.98]",
          "disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        )}
      >
        {isSubmitting || isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            저장 중...
          </>
        ) : (
          <>
            <Heart className="h-4 w-4" />
            QT 저장하기
          </>
        )}
      </button>
    </form>
  );
}
