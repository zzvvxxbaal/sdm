"use client";

import { useMemo, useState } from "react";
import { Music, Plus } from "lucide-react";

import { withAuth, useAuth } from "@/features/auth";
import { useWorshipBoard } from "@/features/worship";
import { WorshipPlaylistCard, WorshipPlaylistFormModal } from "@/components/worship";
import { Badge, Button, Card, EmptyState, PageHeader } from "@/components/ui";
import { WORSHIP_PLAYLIST_CATEGORY_LABELS } from "@/types/worship";
import { hasRole, UserRole } from "@/types";
import type { PlaylistModel } from "@/models/playlist";

const CATEGORY_TABS = ["all", "worship", "qt_music", "personal_devotion"] as const;

type CategoryTab = (typeof CATEGORY_TABS)[number];

function WorshipPage() {
  const { user } = useAuth();
  const [category, setCategory] = useState<CategoryTab>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PlaylistModel | null>(null);
  const { playlists, favorites, favoriteSongIds, loading, error, savePlaylist, removePlaylist, toggleFavorite } = useWorshipBoard(user?.uid, category);

  const canManage = useMemo(() => Boolean(user && hasRole(user.role, UserRole.ADMIN)), [user]);

  return (
    <div className="mx-auto w-full max-w-lg space-y-4 px-4 py-6">
      <PageHeader
        title="예배 플레이리스트"
        description="YouTube 기반 찬양 재생목록과 즐겨찾는 곡을 관리하세요."
        action={canManage ? <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="h-4 w-4" /> 생성</Button> : undefined}
      />

      <div className="flex flex-wrap gap-2">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setCategory(tab)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${category === tab ? "bg-[#2563EB] text-white" : "bg-white text-[#525252] dark:bg-[#1c1c1e] dark:text-[#d4d4d8]"}`}
          >
            {tab === "all" ? "전체" : WORSHIP_PLAYLIST_CATEGORY_LABELS[tab]}
          </button>
        ))}
      </div>

      {favorites.length > 0 && (
        <Card className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-bold text-[#171717] dark:text-[#f5f5f5]">내 즐겨찾기</h2>
            <Badge color="#EF4444">{favorites.length}곡</Badge>
          </div>
          <div className="space-y-2">
            {favorites.slice(0, 5).map((favorite) => (
              <a key={favorite.id} href={favorite.youtubeUrl || undefined} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-[#e5e5e5] px-3 py-2.5 text-sm text-[#525252] transition-colors hover:bg-[#fafafa] dark:border-[#2c2c2e] dark:text-[#d4d4d8] dark:hover:bg-[#262626]">
                {favorite.songTitle}
              </a>
            ))}
          </div>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-48 animate-pulse rounded-3xl bg-[#f5f5f5] dark:bg-[#1f1f22]" />)}
        </div>
      ) : error ? (
        <EmptyState icon={Music} title={error} description="잠시 후 다시 시도해주세요." />
      ) : playlists.length === 0 ? (
        <EmptyState icon={Music} title="플레이리스트가 없습니다" description="첫 재생목록을 만들어 예배 곡을 정리해보세요." />
      ) : (
        <div className="space-y-3">
          {playlists.map((playlist) => (
            <WorshipPlaylistCard
              key={playlist.id}
              playlist={playlist}
              favoriteSongIds={favoriteSongIds}
              canManage={canManage}
              onToggleFavorite={toggleFavorite}
              onEdit={(target) => { setEditing(target); setFormOpen(true); }}
              onDelete={(target) => void removePlaylist(target.id)}
            />
          ))}
        </div>
      )}

      {formOpen && user && (
        <WorshipPlaylistFormModal isOpen initial={editing} onClose={() => setFormOpen(false)} onSave={(input, id) => savePlaylist(input, user.uid, id)} />
      )}
    </div>
  );
}

export default withAuth(WorshipPage);
