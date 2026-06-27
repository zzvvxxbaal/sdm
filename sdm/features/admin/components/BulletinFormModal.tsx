"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal, Button, Field, Input } from "@/components/ui";
import { bulletinFormSchema, type BulletinFormData } from "@/lib/validation";
import type { BulletinInput } from "@/services/content";
import type { BulletinModel } from "@/models/bulletin";

interface BulletinFormModalProps {
  isOpen: boolean;
  initial?: BulletinModel | null;
  onClose: () => void;
  onSave: (data: BulletinInput, id?: string) => Promise<void>;
}

export function BulletinFormModal({
  isOpen,
  initial,
  onClose,
  onSave,
}: BulletinFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BulletinFormData>({
    resolver: zodResolver(bulletinFormSchema),
    defaultValues: {
      title: initial?.title ?? "",
      date: initial?.date ?? "",
      fileURL: initial?.fileURL ?? "",
      preacher: initial?.preacher ?? "",
      scripture: initial?.scripture ?? "",
      sermonTitle: initial?.sermonTitle ?? "",
    },
  });

  const submit = handleSubmit(async (data) => {
    await onSave(
      {
        title: data.title,
        date: data.date,
        fileURL: data.fileURL || null,
        preacher: data.preacher || null,
        scripture: data.scripture || null,
        sermonTitle: data.sermonTitle || null,
      },
      initial?.id,
    );
    onClose();
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initial ? "주보 수정" : "주보 추가"}>
      <form onSubmit={submit} className="space-y-3">
        <Field label="제목" required error={errors.title?.message}>
          <Input {...register("title")} hasError={!!errors.title} placeholder="예: 2026년 6월 4주 주보" />
        </Field>
        <Field label="날짜" required error={errors.date?.message}>
          <Input type="date" {...register("date")} hasError={!!errors.date} />
        </Field>
        <Field label="설교 제목" error={errors.sermonTitle?.message}>
          <Input {...register("sermonTitle")} placeholder="(선택)" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="설교자" error={errors.preacher?.message}>
            <Input {...register("preacher")} placeholder="(선택)" />
          </Field>
          <Field label="본문" error={errors.scripture?.message}>
            <Input {...register("scripture")} placeholder="예: 요 3:16" />
          </Field>
        </div>
        <Field label="파일 링크" hint="PDF 등 외부 링크" error={errors.fileURL?.message}>
          <Input {...register("fileURL")} placeholder="https:// (선택)" />
        </Field>
        <div className="mt-2 flex gap-3">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>
            취소
          </Button>
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            저장
          </Button>
        </div>
      </form>
    </Modal>
  );
}
