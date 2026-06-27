"use client";

import { useMemo, useState } from "react";

import { Modal, Button, Field, Input, Select } from "@/components/ui";
import {
  ChurchPosition,
  CHURCH_POSITION_LABELS,
} from "@/types/member";
import { UserRole, ROLE_LABELS, ASSIGNABLE_ROLES } from "@/types/role";
import type { UserProfile, PrivilegedEditableInput } from "@/types/user";
import type { TeamOption, CellOption } from "../hooks/useMemberAdmin";

interface AssignModalProps {
  isOpen: boolean;
  member: UserProfile;
  teams: TeamOption[];
  cells: CellOption[];
  onClose: () => void;
  onConfirm: (input: PrivilegedEditableInput) => Promise<void>;
}

export function AssignModal({
  isOpen,
  member,
  teams,
  cells,
  onClose,
  onConfirm,
}: AssignModalProps) {
  const [teamId, setTeamId] = useState(member.teamId ?? "");
  const [cellId, setCellId] = useState(member.cellId ?? "");
  const [ministry, setMinistry] = useState(member.ministry ?? "");
  const [position, setPosition] = useState<ChurchPosition>(member.position);
  const [role, setRole] = useState<UserRole>(member.role);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const teamCells = useMemo(
    () => cells.filter((c) => c.teamId === teamId),
    [cells, teamId]
  );

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const team = teams.find((t) => t.id === teamId) ?? null;
      const cell = teamCells.find((c) => c.id === cellId) ?? null;
      await onConfirm({
        teamId: teamId || null,
        teamName: team?.name ?? null,
        cellId: cell ? cell.id : null,
        cellName: cell?.name ?? null,
        ministry: ministry.trim() || null,
        position,
        role,
      });
      onClose();
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="역할 배정"
      description={`${member.displayName ?? "회원"} 님의 팀·셀·직분·권한을 설정합니다.`}
    >
      <div className="space-y-3">
        <Field label="팀">
          <Select
            value={teamId}
            onChange={(e) => {
              setTeamId(e.target.value);
              setCellId("");
            }}
          >
            <option value="">미배정</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="셀">
          <Select
            value={cellId}
            onChange={(e) => setCellId(e.target.value)}
            disabled={!teamId}
          >
            <option value="">미배정</option>
            {teamCells.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="사역">
          <Input
            value={ministry}
            onChange={(e) => setMinistry(e.target.value)}
            placeholder="예: 찬양팀"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="직분">
            <Select
              value={position}
              onChange={(e) => setPosition(e.target.value as ChurchPosition)}
            >
              {Object.values(ChurchPosition).map((p) => (
                <option key={p} value={p}>
                  {CHURCH_POSITION_LABELS[p]}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="권한">
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              {ASSIGNABLE_ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {error && <p className="text-xs font-medium text-red-500">{error}</p>}

        <div className="mt-2 flex gap-3">
          <Button variant="secondary" fullWidth onClick={onClose}>
            취소
          </Button>
          <Button fullWidth onClick={handleConfirm} isLoading={isSubmitting}>
            저장
          </Button>
        </div>
      </div>
    </Modal>
  );
}
