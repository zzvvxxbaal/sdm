"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal, Button, Field, Input, Textarea, Select } from "@/components/ui";
import { cellFormSchema, type CellFormData } from "@/lib/validation";
import type { CellModel } from "@/models/cell";
import type { TeamModel } from "@/models/team";
import type { LeaderOption } from "../hooks/useOrganizationAdmin";

interface CellFormModalProps {
  isOpen: boolean;
  initial?: CellModel | null;
  teams: TeamModel[];
  leaders: LeaderOption[];
  cellLabel: string;
  onClose: () => void;
  onSave: (data: CellFormData, id?: string) => Promise<void>;
}

export function CellFormModal({
  isOpen,
  initial,
  teams,
  leaders,
  cellLabel,
  onClose,
  onSave,
}: CellFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CellFormData>({
    resolver: zodResolver(cellFormSchema),
    defaultValues: {
      name: initial?.name ?? "",
      teamId: initial?.teamId ?? "",
      leaderId: initial?.leaderId ?? "",
      description: initial?.description ?? "",
    },
  });

  const submit = handleSubmit(async (data) => {
    await onSave(data, initial?.id);
    onClose();
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initial ? `${cellLabel} 수정` : `${cellLabel} 추가`}
    >
      <form onSubmit={submit} className="space-y-3">
        <Field label={`${cellLabel} 이름`} required error={errors.name?.message}>
          <Input {...register("name")} placeholder={`예: 1${cellLabel}`} hasError={!!errors.name} />
        </Field>
        <Field label="소속 팀" required error={errors.teamId?.message}>
          <Select {...register("teamId")} hasError={!!errors.teamId}>
            <option value="">팀 선택</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label={`${cellLabel}장`} error={errors.leaderId?.message}>
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
          <Textarea {...register("description")} rows={2} placeholder="소개 (선택)" />
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
