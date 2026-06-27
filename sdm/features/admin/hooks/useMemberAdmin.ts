"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/features/auth";
import {
  listAllMembers,
  approveMember,
  rejectMember,
  updatePrivilegedFields,
  setActiveState,
} from "@/services/user";
import { getAllTeams } from "@/services/team";
import { getAllCells } from "@/services/cell";
import { ApprovalStatus } from "@/types/member";
import type { UserProfile, PrivilegedEditableInput } from "@/types/user";

export interface TeamOption {
  id: string;
  name: string;
}
export interface CellOption {
  id: string;
  name: string;
  teamId: string;
}

export function useMemberAdmin() {
  const { user } = useAuth();
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [cells, setCells] = useState<CellOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [memberList, teamList, cellList] = await Promise.all([
        listAllMembers(),
        getAllTeams(),
        getAllCells(),
      ]);
      setMembers(memberList);
      setTeams(teamList.map((t) => ({ id: t.id, name: t.name })));
      setCells(
        cellList.map((c) => ({ id: c.id, name: c.name, teamId: c.teamId }))
      );
    } catch {
      setError("회원 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const byStatus = useMemo(
    () => ({
      [ApprovalStatus.PENDING]: members.filter(
        (m) => m.approvalStatus === ApprovalStatus.PENDING
      ),
      [ApprovalStatus.APPROVED]: members.filter(
        (m) => m.approvalStatus === ApprovalStatus.APPROVED
      ),
      [ApprovalStatus.REJECTED]: members.filter(
        (m) => m.approvalStatus === ApprovalStatus.REJECTED
      ),
    }),
    [members]
  );

  const approve = useCallback(
    async (uid: string) => {
      if (!user) return;
      await approveMember(uid, user.uid);
      await load();
    },
    [user, load]
  );

  const reject = useCallback(
    async (uid: string, reason: string) => {
      if (!user) return;
      await rejectMember(uid, user.uid, reason);
      await load();
    },
    [user, load]
  );

  const assign = useCallback(
    async (uid: string, input: PrivilegedEditableInput) => {
      await updatePrivilegedFields(uid, input);
      await load();
    },
    [load]
  );

  const setActive = useCallback(
    async (uid: string, isActive: boolean) => {
      await setActiveState(uid, isActive);
      await load();
    },
    [load]
  );

  return {
    byStatus,
    teams,
    cells,
    isLoading,
    error,
    reload: load,
    approve,
    reject,
    assign,
    setActive,
  };
}
