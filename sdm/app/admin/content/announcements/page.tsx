"use client";

import { useState } from "react";
import { Plus, Megaphone } from "lucide-react";

import { useAnnouncementAdmin } from "@/features/admin/hooks/useContentAdmin";
import {
  AnnouncementFormModal,
  AdminListItem,
  ConfirmDialog,
} from "@/features/admin/components";
import { PageHeader, Button, FullScreenSpinner, EmptyState, Badge } from "@/components/ui";
import type { AnnouncementModel } from "@/models/announcement";

export default function AnnouncementsPage() {
  const { items, isLoading, save, remove } = useAnnouncementAdmin();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AnnouncementModel | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AnnouncementModel | null>(null);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <PageHeader
        title="공지사항"
        description="청년부 공지를 관리합니다"
        action={
          <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4" /> 추가
          </Button>
        }
      />

      {isLoading ? (
        <FullScreenSpinner />
      ) : items.length === 0 ? (
        <EmptyState icon={Megaphone} title="공지가 없습니다" description="첫 공지를 작성해보세요." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <AdminListItem
              key={item.id}
              title={item.title}
              subtitle={item.content}
              badges={item.isPinned ? <Badge color="#2563EB">고정</Badge> : undefined}
              onEdit={() => { setEditing(item); setFormOpen(true); }}
              onDelete={() => setDeleteTarget(item)}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <AnnouncementFormModal
          isOpen
          initial={editing}
          onClose={() => setFormOpen(false)}
          onSave={save}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          isOpen
          title="공지 삭제"
          description={`"${deleteTarget.title}"을(를) 삭제할까요?`}
          onConfirm={() => remove(deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
