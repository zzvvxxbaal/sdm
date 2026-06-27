"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal, Button, Field, Input, Textarea, Select } from "@/components/ui";
import { announcementFormSchema, type AnnouncementFormData } from "@/lib/validation";
import type { AnnouncementInput } from "@/services/content";
import type { AnnouncementModel } from "@/models/announcement";

const CATEGORY_LABELS: Record<AnnouncementFormData["category"], string> = {
  general: "일반",
  urgent: "긴급",
  event: "행사",
  ministry: "사역",
};

interface AnnouncementFormModalProps {
  isOpen: boolean;
  initial?: AnnouncementModel | null;
  onClose: () => void;
  onSave: (data: AnnouncementInput, id?: string) => Promise<void>;
}

export function AnnouncementFormModal({
  isOpen,
  initial,
  onClose,
  onSave,
}: AnnouncementFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: initial?.title ?? "",
      content: initial?.content ?? "",
      category: initial?.category ?? "general",
      isPinned: initial?.isPinned ?? false,
    },
  });

  const submit = handleSubmit(async (data) => {
    await onSave(data, initial?.id);
    onClose();
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initial ? "공지 수정" : "공지 작성"}>
      <form onSubmit={submit} className="space-y-3">
        <Field label="제목" required error={errors.title?.message}>
          <Input {...register("title")} hasError={!!errors.title} placeholder="공지 제목" />
        </Field>
        <Field label="분류" error={errors.category?.message}>
          <Select {...register("category")}>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="내용" required error={errors.content?.message}>
          <Textarea {...register("content")} rows={5} placeholder="공지 내용" hasError={!!errors.content} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-[#525252] dark:text-[#a3a3a3]">
          <input type="checkbox" {...register("isPinned")} className="h-4 w-4 rounded accent-[#2563EB]" />
          상단 고정
        </label>
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
