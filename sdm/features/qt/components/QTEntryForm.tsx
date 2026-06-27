"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Field, Input, Select, Textarea, Button, Card } from "@/components/ui";
import type { BibleReference } from "@/types/bible";
import type { QTEntry, QTEntryInput, QTVisibility } from "@/types/qt";
import { parseReference } from "@/services/bible/bibleService";

interface FormValues {
  entryDate: string;
  reference: string;
  title: string;
  meditation: string;
  prayer: string;
  application: string;
  tags: string;
  emotion: string;
  visibility: QTVisibility;
}

const VISIBILITIES: QTVisibility[] = ["private", "cell", "team", "church", "leaders", "admin"];

function toReference(entry?: QTEntry | null) {
  if (!entry) return "";
  const range = entry.bibleReference.endVerse ? `-${entry.bibleReference.endVerse}` : "";
  return `${entry.bibleReference.bookName} ${entry.bibleReference.chapterNumber}:${entry.bibleReference.startVerse}${range}`;
}

export function QTEntryForm({ selectedDate, editing, onSubmit, onCancel, submitting }: { selectedDate: string; editing: QTEntry | null; onSubmit: (value: QTEntryInput) => Promise<void>; onCancel: () => void; submitting: boolean }) {
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      entryDate: selectedDate,
      reference: toReference(editing),
      title: editing?.title ?? "",
      meditation: editing?.meditation ?? "",
      prayer: editing?.prayer ?? "",
      application: editing?.application ?? "",
      tags: editing?.tags.join(", ") ?? "",
      emotion: editing?.emotion ?? "",
      visibility: editing?.visibility ?? "private",
    },
  });

  useEffect(() => {
    reset({
      entryDate: editing?.entryDate ?? selectedDate,
      reference: toReference(editing),
      title: editing?.title ?? "",
      meditation: editing?.meditation ?? "",
      prayer: editing?.prayer ?? "",
      application: editing?.application ?? "",
      tags: editing?.tags.join(", ") ?? "",
      emotion: editing?.emotion ?? "",
      visibility: editing?.visibility ?? "private",
    });
  }, [editing, reset, selectedDate]);

  const submit = handleSubmit(async (values) => {
    const reference = parseReference(values.reference) as BibleReference | null;
    if (!reference) {
      setError("reference", { message: "올바른 성경 참조를 입력해주세요. 예: 요 3:16" });
      return;
    }
    await onSubmit({
      entryDate: values.entryDate,
      bibleReference: reference,
      title: values.title.trim(),
      meditation: values.meditation.trim(),
      prayer: values.prayer.trim(),
      application: values.application.trim(),
      tags: values.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      emotion: values.emotion.trim() || null,
      visibility: values.visibility,
      isFavorite: editing?.isFavorite ?? false,
      isArchived: editing?.isArchived ?? false,
    });
  });

  return (
    <Card className="space-y-3 p-4">
      <div>
        <h3 className="text-base font-bold text-[#171717] dark:text-[#f5f5f5]">{editing ? "QT 수정" : "QT 작성"}</h3>
        <p className="mt-1 text-xs text-[#737373] dark:text-[#a3a3a3]">본문, 묵상, 기도, 적용을 기록하세요.</p>
      </div>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="작성일" required><Input type="date" {...register("entryDate", { required: true })} /></Field>
          <Field label="공개 범위" required><Select {...register("visibility")}>{VISIBILITIES.map((value) => <option key={value} value={value}>{value}</option>)}</Select></Field>
        </div>
        <Field label="성경 본문" required error={errors.reference?.message}><Input {...register("reference", { required: true })} placeholder="예: 요 3:16" hasError={!!errors.reference} /></Field>
        <Field label="제목" required error={errors.title?.message}><Input {...register("title", { required: "제목을 입력해주세요" })} hasError={!!errors.title} /></Field>
        <Field label="묵상" required error={errors.meditation?.message}><Textarea rows={4} {...register("meditation", { required: "묵상을 입력해주세요" })} hasError={!!errors.meditation} /></Field>
        <Field label="기도" required error={errors.prayer?.message}><Textarea rows={3} {...register("prayer", { required: "기도를 입력해주세요" })} hasError={!!errors.prayer} /></Field>
        <Field label="적용" required error={errors.application?.message}><Textarea rows={3} {...register("application", { required: "적용을 입력해주세요" })} hasError={!!errors.application} /></Field>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="태그"><Input {...register("tags")} placeholder="감사, 순종" /></Field>
          <Field label="감정"><Input {...register("emotion")} placeholder="평안, 감사" /></Field>
        </div>
        <div className="flex gap-3">
          {editing && <Button type="button" variant="secondary" fullWidth onClick={onCancel}>취소</Button>}
          <Button type="submit" fullWidth isLoading={submitting}>{editing ? "수정 저장" : "QT 저장"}</Button>
        </div>
      </form>
    </Card>
  );
}
