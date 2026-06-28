"use client";

import { useMemo, useState } from "react";

import { Button, Field, Input, Modal, Select, Textarea } from "@/components/ui";
import { prayerFormSchema } from "@/lib/validation";
import { PRAYER_CATEGORY_LABELS, PRAYER_VISIBILITY_LABELS } from "@/types/prayer";
import type { PrayerRequestInput } from "@/services/prayer";
import type { PrayerRequestModel } from "@/models/prayer_request";

interface PrayerRequestFormModalProps {
  isOpen: boolean;
  initial?: PrayerRequestModel | null;
  onClose: () => void;
  onSave: (data: PrayerRequestInput, id?: string) => Promise<void>;
}

export function PrayerRequestFormModal({ isOpen, initial, onClose, onSave }: PrayerRequestFormModalProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [category, setCategory] = useState<PrayerRequestModel["category"]>(initial?.category ?? "personal");
  const [visibility, setVisibility] = useState<PrayerRequestModel["visibility"]>(initial?.visibility ?? "church");
  const [isAnonymous, setIsAnonymous] = useState(initial?.isAnonymous ?? false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = useMemo(() => Boolean(initial?.id), [initial?.id]);

  const submit = async () => {
    setError(null);
    const parsed = prayerFormSchema.safeParse({ title, content, category, visibility, isAnonymous });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "입력값을 확인해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(parsed.data, initial?.id);
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "기도제목 수정" : "기도제목 작성"}>
      <div className="space-y-3">
        <Field label="제목" required>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="기도제목을 입력하세요" />
        </Field>
        <Field label="내용" required>
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={6}
            placeholder="함께 기도할 내용을 자세히 남겨주세요"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="분류">
            <Select value={category} onChange={(event) => setCategory(event.target.value as PrayerRequestModel["category"])}>
              {Object.entries(PRAYER_CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="공개 범위">
            <Select value={visibility} onChange={(event) => setVisibility(event.target.value as PrayerRequestModel["visibility"])}>
              {Object.entries(PRAYER_VISIBILITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <label className="flex items-center gap-2 rounded-2xl border border-[#e5e5e5] px-4 py-3 text-sm text-[#525252] dark:border-[#2c2c2e] dark:text-[#d4d4d8]">
          <input type="checkbox" checked={isAnonymous} onChange={(event) => setIsAnonymous(event.target.checked)} className="h-4 w-4 rounded border-[#d4d4d8]" />
          익명으로 공유하기
        </label>
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        <div className="flex gap-3">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>
            취소
          </Button>
          <Button type="button" fullWidth isLoading={isSubmitting} onClick={submit}>
            저장
          </Button>
        </div>
      </div>
    </Modal>
  );
}
