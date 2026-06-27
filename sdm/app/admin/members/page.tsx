"use client";

import { useState } from "react";
import { Inbox, Users2, UserX } from "lucide-react";

import { ApprovalStatus } from "@/types/member";
import { useMemberAdmin } from "@/features/admin/hooks/useMemberAdmin";
import { MemberRow, RejectModal, AssignModal } from "@/features/admin/components";
import { PageHeader, FullScreenSpinner, EmptyState, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types/user";

const TABS = [
  { key: ApprovalStatus.PENDING, label: "승인 대기", icon: Inbox },
  { key: ApprovalStatus.APPROVED, label: "승인 완료", icon: Users2 },
  { key: ApprovalStatus.REJECTED, label: "거절", icon: UserX },
] as const;

export default function MembersPage() {
  const { byStatus, teams, cells, isLoading, error, approve, reject, assign, setActive } =
    useMemberAdmin();

  const [tab, setTab] = useState<ApprovalStatus>(ApprovalStatus.PENDING);
  const [rejectTarget, setRejectTarget] = useState<UserProfile | null>(null);
  const [assignTarget, setAssignTarget] = useState<UserProfile | null>(null);

  const list = byStatus[tab];

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <PageHeader title="회원 관리" description="가입 승인과 팀·순·직분·권한을 관리합니다" />

      <div className="mb-5 flex gap-1 rounded-xl bg-[#f5f5f5] p-1 dark:bg-[#262626]">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all",
              tab === key
                ? "bg-white text-[#171717] shadow-sm dark:bg-[#1c1c1e] dark:text-[#f5f5f5]"
                : "text-[#737373] hover:text-[#171717] dark:hover:text-[#f5f5f5]",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            <Badge>{byStatus[key].length}</Badge>
          </button>
        ))}
      </div>

      {isLoading ? (
        <FullScreenSpinner />
      ) : error ? (
        <EmptyState icon={UserX} title="불러오기 실패" description={error} />
      ) : list.length === 0 ? (
        <EmptyState icon={Inbox} title="회원이 없습니다" description="해당 상태의 회원이 아직 없어요." />
      ) : (
        <div className="space-y-3">
          {list.map((member) => (
            <MemberRow
              key={member.uid}
              member={member}
              onApprove={() => approve(member.uid)}
              onReject={() => setRejectTarget(member)}
              onAssign={() => setAssignTarget(member)}
              onToggleActive={() => setActive(member.uid, !member.isActive)}
            />
          ))}
        </div>
      )}

      {rejectTarget && (
        <RejectModal
          isOpen={!!rejectTarget}
          memberName={rejectTarget.displayName ?? "회원"}
          onClose={() => setRejectTarget(null)}
          onConfirm={(reason) => reject(rejectTarget.uid, reason)}
        />
      )}

      {assignTarget && (
        <AssignModal
          isOpen={!!assignTarget}
          member={assignTarget}
          teams={teams}
          cells={cells}
          onClose={() => setAssignTarget(null)}
          onConfirm={(input) => assign(assignTarget.uid, input)}
        />
      )}
    </div>
  );
}
