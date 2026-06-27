"use client";

import { useState } from "react";
import { Plus, Calendar } from "lucide-react";

import { useEventAdmin } from "@/features/admin/hooks/useContentAdmin";
import { EventFormModal, AdminListItem, ConfirmDialog } from "@/features/admin/components";
import { PageHeader, Button, FullScreenSpinner, EmptyState } from "@/components/ui";
import type { EventModel } from "@/models/event";

export default function EventsPage() {
  const { items, isLoading, save, remove } = useEventAdmin();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<EventModel | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EventModel | null>(null);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <PageHeader
        title="일정"
        description="모임과 행사 일정을 관리합니다"
        action={
          <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4" /> 추가
          </Button>
        }
      />

      {isLoading ? (
        <FullScreenSpinner />
      ) : items.length === 0 ? (
        <EmptyState icon={Calendar} title="일정이 없습니다" description="첫 일정을 추가해보세요." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <AdminListItem
              key={item.id}
              title={item.title}
              subtitle={item.description}
              meta={[item.startDate, item.location].filter(Boolean).join(" · ")}
              onEdit={() => { setEditing(item); setFormOpen(true); }}
              onDelete={() => setDeleteTarget(item)}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <EventFormModal isOpen initial={editing} onClose={() => setFormOpen(false)} onSave={save} />
      )}
      {deleteTarget && (
        <ConfirmDialog
          isOpen
          title="일정 삭제"
          description={`"${deleteTarget.title}"을(를) 삭제할까요?`}
          onConfirm={() => remove(deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
