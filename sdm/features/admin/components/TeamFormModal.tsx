"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal, Button, Field, Input, Textarea, Select } from "@/components/ui";
import { teamFormSchema, type TeamFormData } from "@/lib/validation";
import type { TeamModel } from "@/models/team";
import type { LeaderOption } from "../hooks/useOrganizationAdmin";

interface TeamFormModalProps {
  isOpen: boolean;
  initial?: TeamModel | null;
  leaders: LeaderOption[];
  onClose: () => void;
  onSave: (data: TeamFormData, id?: string) => Promise<void>;
}

export function TeamFormModal({
  isOpen,
  initial,
  leaders,
  onClose,
  onSave,
}: TeamFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: initial?.name ?? "",
      description: initial?.description ?? "",
      leaderId: initial?.leaderId ?? "",
    },
  });

  const submit = handleSubmit(async (data) => {
    await onSave(data, initial?.id);
    onClose();
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initial ? "팀 수정" : "팀 추가"}>
      <form onSubmit={submit} className="space-y-3">
        <Field label="팀 이름" required error={errors.name?.message}>
          <Input {...register("name")} placeholder="예: 1팀" hasError={!!errors.name} />
        </Field>
        <Field label="팀장" error={errors.leaderId?.message}>
          <Select {...register("leaderId")}>
            <option value="">미지정</option>
            {leaders.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="설명" error={errors.description?.message}>
          <Textarea {...register("description")} rows={2} placeholder="팀 소개 (선택)" />
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
