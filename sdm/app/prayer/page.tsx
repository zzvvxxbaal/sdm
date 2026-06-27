"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import { withAuth, useAuth } from "@/features/auth";
import { usePrayerBoard } from "@/features/prayer";
import { PrayerRequestCard, PrayerRequestFormModal } from "@/components/prayer";
import { Button, EmptyState, Input, PageHeader } from "@/components/ui";
import { hasRole, UserRole } from "@/types";
import type { PrayerRequestModel } from "@/models/prayer_request";

function PrayerPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PrayerRequestModel | null>(null);
  const { prayers, likedMap, loading, error, savePrayer, removePrayer, likePrayer, pinPrayer } = usePrayerBoard(searchTerm);

  const canPin = useMemo(() => Boolean(user && hasRole(user.role, UserRole.LEADER)), [user]);

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-6">
      <PageHeader
        title="기도제목"
        description="교회 공동체와 함께 중보기도를 나누고 응답을 기록하세요."
        action={
          <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4" /> 작성
          </Button>
        }
      />

      <div className="mb-4 rounded-2xl border border-[#e5e5e5] bg-white p-3 dark:border-[#2c2c2e] dark:bg-[#1c1c1e]">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-[#a3a3a3]" />
          <Input className="border-none bg-transparent px-0 focus:ring-0" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="기도제목 검색" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-3xl bg-[#f5f5f5] dark:bg-[#1f1f22]" />
          ))}
        </div>
      ) : error ? (
        <EmptyState title={error} description="잠시 후 다시 시도해주세요." />
      ) : prayers.length === 0 ? (
        <EmptyState title="등록된 기도제목이 없습니다" description="첫 번째 기도제목을 작성해보세요." />
      ) : (
        <div className="space-y-3">
          {prayers.map((prayer) => {
            const canEdit = Boolean(user && (prayer.createdBy === user.uid || hasRole(user.role, UserRole.LEADER)));
            return (
              <PrayerRequestCard
                key={prayer.id}
                prayer={prayer}
                liked={Boolean(likedMap[prayer.id])}
                canEdit={canEdit}
                canPin={canPin}
                onLike={likePrayer}
                onEdit={(target) => { setEditing(target); setFormOpen(true); }}
                onDelete={(target) => void removePrayer(target.id)}
                onTogglePin={pinPrayer}
              />
            );
          })}
        </div>
      )}

      {formOpen && (
        <PrayerRequestFormModal isOpen initial={editing} onClose={() => setFormOpen(false)} onSave={savePrayer} />
      )}
    </div>
  );
}

export default withAuth(PrayerPage);
