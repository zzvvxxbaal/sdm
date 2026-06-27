"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardHeader, Button, Field, Input, Textarea } from "@/components/ui";
import {
  todaysVerseFormSchema,
  todaysQtFormSchema,
  type TodaysVerseFormData,
  type TodaysQtFormData,
} from "@/lib/validation";
import type { TodaysVerse, TodaysQtPassage } from "@/models/daily_content";

interface VerseFormProps {
  initial: TodaysVerse | null;
  onSave: (value: TodaysVerse) => Promise<void>;
}

export function TodaysVerseForm({ initial, onSave }: VerseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TodaysVerseFormData>({
    resolver: zodResolver(todaysVerseFormSchema),
    defaultValues: { reference: initial?.reference ?? "", text: initial?.text ?? "" },
  });

  const submit = handleSubmit(async (data) => {
    await onSave({ reference: data.reference, text: data.text });
  });

  return (
    <Card>
      <CardHeader title="오늘의 말씀" description="홈 화면에 노출될 말씀을 설정합니다" />
      <form onSubmit={submit} className="space-y-3">
        <Field label="구절 위치" required error={errors.reference?.message}>
          <Input {...register("reference")} placeholder="예: 요한복음 3:16" hasError={!!errors.reference} />
        </Field>
        <Field label="말씀 본문" required error={errors.text?.message}>
          <Textarea {...register("text")} rows={3} placeholder="말씀 내용" hasError={!!errors.text} />
        </Field>
        <Button type="submit" fullWidth isLoading={isSubmitting} disabled={!isDirty}>
          말씀 저장
        </Button>
      </form>
    </Card>
  );
}

interface QtFormProps {
  initial: TodaysQtPassage | null;
  onSave: (value: TodaysQtPassage) => Promise<void>;
}

export function TodaysQtForm({ initial, onSave }: QtFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TodaysQtFormData>({
    resolver: zodResolver(todaysQtFormSchema),
    defaultValues: {
      reference: initial?.reference ?? "",
      title: initial?.title ?? "",
      description: initial?.description ?? "",
    },
  });

  const submit = handleSubmit(async (data) => {
    await onSave({
      reference: data.reference,
      title: data.title,
      description: data.description || null,
    });
  });

  return (
    <Card>
      <CardHeader title="오늘의 QT" description="오늘의 묵상 본문을 설정합니다" />
      <form onSubmit={submit} className="space-y-3">
        <Field label="본문 위치" required error={errors.reference?.message}>
          <Input {...register("reference")} placeholder="예: 시편 23편" hasError={!!errors.reference} />
        </Field>
        <Field label="제목" required error={errors.title?.message}>
          <Input {...register("title")} placeholder="QT 제목" hasError={!!errors.title} />
        </Field>
        <Field label="안내" error={errors.description?.message}>
          <Textarea {...register("description")} rows={3} placeholder="묵상 안내 (선택)" />
        </Field>
        <Button type="submit" fullWidth isLoading={isSubmitting} disabled={!isDirty}>
          QT 저장
        </Button>
      </form>
    </Card>
  );
}
