"use client";

import { useState } from "react";
import { Plus, Network, Boxes } from "lucide-react";

import { useOrganizationAdmin } from "@/features/admin/hooks/useOrganizationAdmin";
import { useSettings } from "@/features/admin/hooks/useSettings";
import {
  TeamFormModal,
  CellFormModal,
  AdminListItem,
  ConfirmDialog,
} from "@/features/admin/components";
import { PageHeader, Button, FullScreenSpinner, EmptyState, Badge } from "@/components/ui";
import type { TeamModel } from "@/models/team";
import type { CellModel } from "@/models/cell";

type DeleteTarget = { kind: "team" | "cell"; id: string; name: string } | null;

export default function OrganizationPage() {
  const { teams, cells, leaders, isLoading, saveTeam, removeTeam, saveCell, removeCell } =
    useOrganizationAdmin();
  const { cellLabel } = useSettings();

  const [teamModal, setTeamModal] = useState(false);
  const [editTeam, setEditTeam] = useState<TeamModel | null>(null);
  const [cellModal, setCellModal] = useState(false);
  const [editCell, setEditCell] = useState<CellModel | null>(null);
  const [del, setDel] = useState<DeleteTarget>(null);

  const teamName = (id: string) => teams.find((t) => t.id === id)?.name ?? "미지정";
  const label = cellLabel.singular;

  if (isLoading) return <FullScreenSpinner />;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 px-4 py-6">
      <PageHeader title="조직 관리" description="팀과 소그룹을 편성하고 리더를 지정합니다" />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-sm font-bold text-[#171717] dark:text-[#f5f5f5]">
            <Network className="h-4 w-4 text-[#2563EB]" /> 팀
          </h2>
          <Button size="sm" onClick={() => { setEditTeam(null); setTeamModal(true); }}>
            <Plus className="h-4 w-4" /> 팀 추가
          </Button>
        </div>
        {teams.length === 0 ? (
          <EmptyState icon={Network} title="팀이 없습니다" description="첫 팀을 추가해보세요." />
        ) : (
          <div className="space-y-2">
            {teams.map((t) => (
              <AdminListItem
                key={t.id}
                title={t.name}
                subtitle={t.description}
                meta={`구성원 ${t.memberCount}명`}
                badges={t.leaderName ? <Badge color="#0EA5E9">{t.leaderName} 팀장</Badge> : undefined}
                onEdit={() => { setEditTeam(t); setTeamModal(true); }}
                onDelete={() => setDel({ kind: "team", id: t.id, name: t.name })}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-sm font-bold text-[#171717] dark:text-[#f5f5f5]">
            <Boxes className="h-4 w-4 text-[#2563EB]" /> {label}
          </h2>
          <Button
            size="sm"
            onClick={() => { setEditCell(null); setCellModal(true); }}
            disabled={teams.length === 0}
          >
            <Plus className="h-4 w-4" /> {label} 추가
          </Button>
        </div>
        {cells.length === 0 ? (
          <EmptyState icon={Boxes} title={`${label}이 없습니다`} description={`팀을 먼저 만든 뒤 ${label}을 추가하세요.`} />
        ) : (
          <div className="space-y-2">
            {cells.map((c) => (
              <AdminListItem
                key={c.id}
                title={c.name}
                subtitle={c.description}
                meta={`${teamName(c.teamId)} · 구성원 ${c.memberCount}명`}
                badges={c.leaderName ? <Badge color="#0EA5E9">{c.leaderName} {label}장</Badge> : undefined}
                onEdit={() => { setEditCell(c); setCellModal(true); }}
                onDelete={() => setDel({ kind: "cell", id: c.id, name: c.name })}
              />
            ))}
          </div>
        )}
      </section>

      {teamModal && (
        <TeamFormModal
          isOpen
          initial={editTeam}
          leaders={leaders}
          onClose={() => setTeamModal(false)}
          onSave={saveTeam}
        />
      )}
      {cellModal && (
        <CellFormModal
          isOpen
          initial={editCell}
          teams={teams}
          leaders={leaders}
          cellLabel={label}
          onClose={() => setCellModal(false)}
          onSave={saveCell}
        />
      )}
      {del && (
        <ConfirmDialog
          isOpen
          title={`${del.kind === "team" ? "팀" : label} 삭제`}
          description={`"${del.name}"을(를) 삭제할까요? 되돌릴 수 없습니다.`}
          onConfirm={() => (del.kind === "team" ? removeTeam(del.id) : removeCell(del.id))}
          onClose={() => setDel(null)}
        />
      )}
    </div>
  );
}
