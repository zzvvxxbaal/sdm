"use client";

import { Avatar, Badge, Button } from "@/components/ui";
import {
  ApprovalStatus,
  CHURCH_POSITION_LABELS,
} from "@/types/member";
import { ROLE_LABELS, ROLE_COLORS } from "@/types/role";
import { formatDate } from "@/lib/utils";
import type { UserProfile } from "@/types/user";

interface MemberRowProps {
  member: UserProfile;
  onApprove?: () => void;
  onReject?: () => void;
  onAssign?: () => void;
  onToggleActive?: () => void;
}

export function MemberRow({
  member,
  onApprove,
  onReject,
  onAssign,
  onToggleActive,
}: MemberRowProps) {
  const isPending = member.approvalStatus === ApprovalStatus.PENDING;
  const isApproved = member.approvalStatus === ApprovalStatus.APPROVED;

  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-4 dark:border-[#2c2c2e] dark:bg-[#1c1c1e]">
      <div className="flex items-start gap-3">
        <Avatar src={member.photoURL} name={member.displayName} size={44} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="truncate text-sm font-bold text-[#171717] dark:text-[#f5f5f5]">
              {member.displayName ?? "이름 미설정"}
            </span>
            {member.generation && <Badge>{member.generation}</Badge>}
            <Badge color={ROLE_COLORS[member.role]}>
              {ROLE_LABELS[member.role]}
            </Badge>
            {isApproved && !member.isActive && (
              <Badge color="#737373">비활성</Badge>
            )}
          </div>
          <p className="truncate text-xs text-[#737373] dark:text-[#a3a3a3]">
            {member.email}
          </p>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[#a3a3a3]">
            {member.phoneNumber && <span>{member.phoneNumber}</span>}
            <span>
              {member.teamName ?? "팀 미배정"} ·{" "}
              {CHURCH_POSITION_LABELS[member.position]}
            </span>
            <span>가입 {formatDate(member.createdAt)}</span>
          </div>
          {member.approvalStatus === ApprovalStatus.REJECTED &&
            member.rejectionReason && (
              <p className="mt-1.5 rounded-lg bg-[#fef2f2] px-2 py-1 text-xs text-[#ef4444] dark:bg-[#3f1f1f]/40">
                거절 사유: {member.rejectionReason}
              </p>
            )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap justify-end gap-2">
        {isPending && (
          <>
            <Button size="sm" variant="danger" onClick={onReject}>
              거절
            </Button>
            <Button size="sm" onClick={onApprove}>
              승인
            </Button>
          </>
        )}
        {isApproved && (
          <>
            <Button size="sm" variant="secondary" onClick={onToggleActive}>
              {member.isActive ? "비활성화" : "활성화"}
            </Button>
            <Button size="sm" onClick={onAssign}>
              역할 배정
            </Button>
          </>
        )}
        {member.approvalStatus === ApprovalStatus.REJECTED && (
          <Button size="sm" onClick={onApprove}>
            재승인
          </Button>
        )}
      </div>
    </div>
  );
}
