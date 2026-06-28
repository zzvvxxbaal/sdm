"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/features/auth";
import { getAllTeams, createTeam, updateTeam, deleteTeam } from "@/services/team";
import { getAllCells, createCell, updateCell, deleteCell } from "@/services/cell";
import { listAllMembers } from "@/services/user";
import type { TeamModel } from "@/models/team";
import type { CellModel } from "@/models/cell";
import type { TeamFormData, CellFormData } from "@/lib/validation";

export interface LeaderOption {
  id: string;
  name: string;
}

export function useOrganizationAdmin() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<TeamModel[]>([]);
  const [cells, setCells] = useState<CellModel[]>([]);
  const [leaders, setLeaders] = useState<LeaderOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [teamList, cellList, members] = await Promise.all([
        getAllTeams(),
        getAllCells(),
        listAllMembers(),
      ]);
      setTeams(teamList);
      setCells(cellList);
      setLeaders(members.map((m) => ({ id: m.uid, name: m.displayName ?? "이름없음" })));
    } catch {
      setError("조직 정보를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const [teamList, cellList, members] = await Promise.all([
          getAllTeams(),
          getAllCells(),
          listAllMembers(),
        ]);
        if (!active) return;
        setTeams(teamList);
        setCells(cellList);
        setLeaders(members.map((m) => ({ id: m.uid, name: m.displayName ?? "이름없음" })));
      } catch {
        if (active) setError("조직 정보를 불러오지 못했습니다.");
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const nameOf = useCallback(
    (id: string) => leaders.find((l) => l.id === id)?.name ?? null,
    [leaders],
  );

  const saveTeam = useCallback(
    async (data: TeamFormData, id?: string) => {
      const leaderId = data.leaderId || null;
      const payload = {
        name: data.name,
        description: data.description || null,
        leaderId,
        leaderName: leaderId ? nameOf(leaderId) : null,
      };
      if (id) await updateTeam(id, { ...payload, updatedBy: user?.uid });
      else await createTeam({ ...payload, createdBy: user?.uid });
      await load();
    },
    [user, load, nameOf],
  );

  const removeTeam = useCallback(
    async (id: string) => {
      await deleteTeam(id);
      await load();
    },
    [load],
  );

  const saveCell = useCallback(
    async (data: CellFormData, id?: string) => {
      const leaderId = data.leaderId || null;
      const payload = {
        name: data.name,
        teamId: data.teamId,
        description: data.description || null,
        leaderId,
        leaderName: leaderId ? nameOf(leaderId) : null,
      };
      if (id) await updateCell(id, { ...payload, updatedBy: user?.uid });
      else await createCell({ ...payload, createdBy: user?.uid });
      await load();
    },
    [user, load, nameOf],
  );

  const removeCell = useCallback(
    async (id: string) => {
      await deleteCell(id);
      await load();
    },
    [load],
  );

  return {
    teams,
    cells,
    leaders,
    isLoading,
    error,
    reload: load,
    saveTeam,
    removeTeam,
    saveCell,
    removeCell,
  };
}
