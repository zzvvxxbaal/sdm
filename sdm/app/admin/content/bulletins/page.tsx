"use client";

import { useState } from "react";
import { Plus, FileText } from "lucide-react";

import { useBulletinAdmin } from "@/features/admin/hooks/useContentAdmin";
import { BulletinFormModal, AdminListItem, ConfirmDialog } from "@/features/admin/components";
import { PageHeader, Button, FullScreenSpinner, EmptyState } from "@/components/ui";
import type { BulletinModel } from "@/models/bulletin";

export default function BulletinsPage() {
  const { items, isLoading, save, remove } = useBulletinAdmin();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BulletinModel | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BulletinModel | null>(null);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <PageHeader
        title="주보"
        description="주간 주보를 등록하고 관리합니다"
        action={
          <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4" /> 추가
          </Button>
        }
      />

      {isLoading ? (
        <FullScreenSpinner />
      ) : items.length === 0 ? (
        <EmptyState icon={FileText} title="주보가 없습니다" description="첫 주보를 등록해보세요." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <AdminListItem
              key={item.id}
              title={item.title}
              subtitle={item.sermonTitle}
              meta={[item.date, item.preacher].filter(Boolean).join(" · ")}
              onEdit={() => { setEditing(item); setFormOpen(true); }}
              onDelete={() => setDeleteTarget(item)}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <BulletinFormModal isOpen initial={editing} onClose={() => setFormOpen(false)} onSave={save} />
      )}
      {deleteTarget && (
        <ConfirmDialog
          isOpen
          title="주보 삭제"
          description={`"${deleteTarget.title}"을(를) 삭제할까요?`}
          onConfirm={() => remove(deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
