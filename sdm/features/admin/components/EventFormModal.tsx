"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal, Button, Field, Input, Textarea, Select } from "@/components/ui";
import { eventFormSchema, type EventFormData } from "@/lib/validation";
import type { EventInput } from "@/services/content";
import type { EventModel } from "@/models/event";

const CATEGORY_LABELS: Record<EventFormData["category"], string> = {
  worship: "예배",
  meeting: "모임",
  event: "행사",
  special_service: "특별예배",
};

interface EventFormModalProps {
  isOpen: boolean;
  initial?: EventModel | null;
  onClose: () => void;
  onSave: (data: EventInput, id?: string) => Promise<void>;
}

export function EventFormModal({ isOpen, initial, onClose, onSave }: EventFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: initial?.title ?? "",
      startDate: initial?.startDate ? initial.startDate.slice(0, 16) : "",
      endDate: initial?.endDate ? initial.endDate.slice(0, 16) : "",
      location: initial?.location ?? "",
      category: initial?.category ?? "event",
      description: initial?.description ?? "",
      isAllDay: initial?.isAllDay ?? false,
    },
  });

  const submit = handleSubmit(async (data) => {
    await onSave(
      {
        title: data.title,
        startDate: new Date(data.startDate).toISOString(),
        endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
        location: data.location || null,
        category: data.category,
        description: data.description || null,
        isAllDay: data.isAllDay,
      },
      initial?.id,
    );
    onClose();
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initial ? "일정 수정" : "일정 추가"}>
      <form onSubmit={submit} className="space-y-3">
        <Field label="제목" required error={errors.title?.message}>
          <Input {...register("title")} hasError={!!errors.title} placeholder="일정 제목" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="시작일시" required error={errors.startDate?.message}>
            <Input type="datetime-local" {...register("startDate")} hasError={!!errors.startDate} />
          </Field>
          <Field label="종료일시" error={errors.endDate?.message}>
            <Input type="datetime-local" {...register("endDate")} />
          </Field>
        </div>
        <Field label="분류">
          <Select {...register("category")}>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="장소" error={errors.location?.message}>
          <Input {...register("location")} placeholder="예: 본당 (선택)" />
        </Field>
        <Field label="설명" error={errors.description?.message}>
          <Textarea {...register("description")} rows={3} placeholder="일정 설명 (선택)" />
        </Field>
        <label className="flex items-center gap-2 text-sm text-[#525252] dark:text-[#d4d4d8]">
          <input type="checkbox" {...register("isAllDay")} className="h-4 w-4 rounded border-[#d4d4d8]" /> 종일 일정
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
