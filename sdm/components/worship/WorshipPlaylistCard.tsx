"use client";

import { Heart, PlayCircle, Pencil, Trash2 } from "lucide-react";

import { Badge, Button, Card } from "@/components/ui";
import { WORSHIP_PLAYLIST_CATEGORY_LABELS } from "@/types/worship";
import type { PlaylistModel, PlaylistSong } from "@/models/playlist";

interface WorshipPlaylistCardProps {
  playlist: PlaylistModel;
  favoriteSongIds: Set<string>;
  canManage: boolean;
  onToggleFavorite: (playlist: PlaylistModel, song: PlaylistSong) => Promise<void>;
  onEdit?: (playlist: PlaylistModel) => void;
  onDelete?: (playlist: PlaylistModel) => void;
}

export function WorshipPlaylistCard({ playlist, favoriteSongIds, canManage, onToggleFavorite, onEdit, onDelete }: WorshipPlaylistCardProps) {
  const songs = [...playlist.songs].sort((left, right) => left.order - right.order);

  return (
    <Card className="space-y-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#171717] dark:text-[#f5f5f5]">{playlist.name}</h3>
            <Badge color="#2563EB">{WORSHIP_PLAYLIST_CATEGORY_LABELS[playlist.category]}</Badge>
          </div>
          <p className="mt-1 text-xs text-[#737373] dark:text-[#a3a3a3]">총 {songs.length}곡 · 즐겨찾기 {playlist.favoriteCount}</p>
        </div>
        {canManage && (
          <div className="flex items-center gap-1">
            {onEdit && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(playlist)}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onDelete(playlist)}>
                <Trash2 className="h-4 w-4 text-[#EF4444]" />
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="space-y-2">
        {songs.map((song) => {
          const favoriteKey = `${playlist.id}:${song.id}`;
          const isFavorite = favoriteSongIds.has(favoriteKey);
          return (
            <div key={song.id} className="flex items-center gap-3 rounded-2xl border border-[#e5e5e5] p-3 dark:border-[#2c2c2e]">
              <a href={song.youtubeUrl || undefined} target="_blank" rel="noopener noreferrer" className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB]/10 text-[#2563EB]">
                  <PlayCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#171717] dark:text-[#f5f5f5]">{song.title}</p>
                  <p className="truncate text-xs text-[#737373] dark:text-[#a3a3a3]">{song.artist || "아티스트 미등록"}</p>
                </div>
              </a>
              <button type="button" onClick={() => void onToggleFavorite(playlist, song)} className="rounded-full p-2 text-[#a3a3a3] transition-colors hover:bg-[#fff1f2] hover:text-[#EF4444]">
                <Heart className={isFavorite ? "h-4 w-4 fill-current text-[#EF4444]" : "h-4 w-4"} />
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
