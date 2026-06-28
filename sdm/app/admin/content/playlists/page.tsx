"use client";

import { useState } from "react";
import { Plus, Music } from "lucide-react";

import { usePlaylistAdmin } from "@/features/admin/hooks/useContentAdmin";
import { PlaylistFormModal, AdminListItem, ConfirmDialog } from "@/features/admin/components";
import { PageHeader, Button, FullScreenSpinner, EmptyState, Badge } from "@/components/ui";
import type { PlaylistModel } from "@/models/playlist";

const CATEGORY_LABELS: Record<PlaylistModel["category"], string> = {
  worship: "예배",
  qt_music: "QT 음악",
  personal_devotion: "개인 경건",
};

export default function PlaylistsPage() {
  const { items, isLoading, save, remove } = usePlaylistAdmin();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PlaylistModel | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PlaylistModel | null>(null);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <PageHeader
        title="찬양 콘티"
        description="예배·QT·개인 경건 재생목록을 관리합니다"
        action={
          <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4" /> 추가
          </Button>
        }
      />

      {isLoading ? (
        <FullScreenSpinner />
      ) : items.length === 0 ? (
        <EmptyState icon={Music} title="재생목록이 없습니다" description="첫 콘티를 만들어보세요." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <AdminListItem
              key={item.id}
              title={item.name}
              meta={`${item.songs.length}곡`}
              badges={<Badge>{CATEGORY_LABELS[item.category]}</Badge>}
              onEdit={() => { setEditing(item); setFormOpen(true); }}
              onDelete={() => setDeleteTarget(item)}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <PlaylistFormModal isOpen initial={editing} onClose={() => setFormOpen(false)} onSave={save} />
      )}
      {deleteTarget && (
        <ConfirmDialog
          isOpen
          title="재생목록 삭제"
          description={`"${deleteTarget.name}"을(를) 삭제할까요?`}
          onConfirm={() => remove(deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
