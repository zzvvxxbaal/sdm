"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Send, Loader2, Eye, EyeOff } from "lucide-react";
import type { PrayerRequestModel } from "@/models/prayer_request";

interface PrayerEditorProps {
  onSubmit: (data: Omit<PrayerRequestModel, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">) => Promise<void>;
  isLoading?: boolean;
}

export function PrayerEditor({ onSubmit, isLoading = false }: PrayerEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"personal" | "family" | "church" | "mission" | "healing" | "other">("personal");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("기도제목을 입력해주세요");
      return;
    }

    if (!content.trim()) {
      setError("기도 내용을 입력해주세요");
      return;
    }

    setIsSubmitting(true);

    try {
      const data: Omit<PrayerRequestModel, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"> = {
        title: title.trim(),
        content: content.trim(),
        category,
        isAnonymous,
        isAnswered: false,
        answeredAt: null,
        prayerCount: 0,
        isActive: true,
      };

      await onSubmit(data);

      // Reset form
      setTitle("");
      setContent("");
      setCategory("personal");
      setIsAnonymous(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "기도제목 저장에 실패했습니다";
      setError(errorMessage);
      console.error("Prayer submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="text-xs font-semibold text-[#737373] mb-1.5 block">기도제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="기도제목을 입력해주세요"
          disabled={isSubmitting || isLoading}
          maxLength={200}
          className={cn(
            "w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm",
            "placeholder:text-[#a3a3a3] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#f5f5f5]"
          )}
        />
        <div className="mt-1 text-xs text-[#a3a3a3]">{title.length}/200</div>
      </div>

      {/* Content */}
      <div>
        <label className="text-xs font-semibold text-[#737373] mb-1.5 block">기도 내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="기도 내용을 입력해주세요"
          disabled={isSubmitting || isLoading}
          rows={4}
          className={cn(
            "w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm resize-none",
            "placeholder:text-[#a3a3a3] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#f5f5f5]"
          )}
        />
      </div>

      {/* Category */}
      <div>
        <label className="text-xs font-semibold text-[#737373] mb-1.5 block">카테고리</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as "personal" | "family" | "church" | "mission" | "healing" | "other")}
          disabled={isSubmitting || isLoading}
          className={cn(
            "w-full rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm",
            "outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "dark:bg-[#1c1c1e] dark:border-[#2c2c2e] dark:text-[#f5f5f5]"
          )}
        >
          <option value="personal">개인적인 기도</option>
          <option value="family">가정을 위한 기도</option>
          <option value="church">교회를 위한 기도</option>
          <option value="mission">선교를 위한 기도</option>
          <option value="healing">치유를 위한 기도</option>
          <option value="other">기타</option>
        </select>
      </div>

      {/* Anonymous Toggle */}
      <div className="flex items-center justify-between rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 dark:bg-[#1c1c1e] dark:border-[#2c2c2e]">
        <div className="flex items-center gap-2">
          {isAnonymous ? (
            <EyeOff className="w-4 h-4 text-[#737373]" />
          ) : (
            <Eye className="w-4 h-4 text-[#737373]" />
          )}
          <span className="text-sm font-medium text-[#171717] dark:text-[#f5f5f5]">
            {isAnonymous ? "익명으로 공개" : "이름 공개"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsAnonymous(!isAnonymous)}
          disabled={isSubmitting || isLoading}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            isAnonymous ? "bg-[#2563EB]" : "bg-[#e5e5e5]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "dark:bg-[#2c2c2e]"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform dark:bg-[#1c1c1e]",
              isAnonymous ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 dark:bg-red-950 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || isLoading || !title.trim() || !content.trim()}
        className={cn(
          "w-full rounded-xl bg-[#2563EB] text-white font-semibold py-3 px-4",
          "hover:bg-[#1d4ed8] transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "flex items-center justify-center gap-2"
        )}
      >
        {isSubmitting || isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>저장 중...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>기도제목 등록</span>
          </>
        )}
      </button>
    </form>
  );
}
