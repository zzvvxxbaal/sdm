"use client";

import { useMemo, useState } from "react";
import { FileText, Plus, Search } from "lucide-react";

import { withAuth, useAuth } from "@/features/auth";
import { useBulletinBoard } from "@/features/bulletin";
import { BulletinArchiveCard, BulletinFormModal, BulletinViewerModal } from "@/components/bulletin";
import { Button, EmptyState, Input, PageHeader } from "@/components/ui";
import { hasRole, UserRole } from "@/types";
import type { BulletinModel } from "@/models/bulletin";

function BulletinPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewer, setViewer] = useState<BulletinModel | null>(null);
  const [editing, setEditing] = useState<BulletinModel | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const { items, loading, error, saveBulletin, removeBulletin } = useBulletinBoard(searchTerm);

  const canManage = useMemo(() => Boolean(user && hasRole(user.role, UserRole.ADMIN)), [user]);

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 px-4 py-6">
      <PageHeader
        title="주보 아카이브"
        description="주차별 주보를 날짜로 검색하고 전체 화면으로 확인하세요."
        action={canManage ? <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="h-4 w-4" /> 등록</Button> : undefined}
      />

      <div className="rounded-2xl border border-[#e5e5e5] bg-white p-3 dark:border-[#2c2c2e] dark:bg-[#1c1c1e]">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-[#a3a3a3]" />
          <Input className="border-none bg-transparent px-0 focus:ring-0" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="날짜 검색 (예: 2026-06)" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-40 animate-pulse rounded-3xl bg-[#f5f5f5] dark:bg-[#1f1f22]" />)}
        </div>
      ) : error ? (
        <EmptyState icon={FileText} title={error} description="잠시 후 다시 시도해주세요." />
      ) : items.length === 0 ? (
        <EmptyState icon={FileText} title="등록된 주보가 없습니다" description="첫 주보를 등록해보세요." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="space-y-2">
              <BulletinArchiveCard bulletin={item} onView={setViewer} />
              {canManage && (
                <div className="flex gap-2">
                  <Button type="button" size="sm" variant="secondary" onClick={() => { setEditing(item); setFormOpen(true); }}>수정</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => void removeBulletin(item.id)}>삭제</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {formOpen && user && <BulletinFormModal isOpen initial={editing} onClose={() => setFormOpen(false)} onSave={(input, id) => saveBulletin(input, user.uid, id)} />}
      <BulletinViewerModal bulletin={viewer} onClose={() => setViewer(null)} />
    </div>
  );
}

export default withAuth(BulletinPage);
