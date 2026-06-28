import { Music, Play } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { SectionError } from "./SectionError";
import { Badge, EmptyState } from "@/components/ui";
import { WORSHIP_PLAYLIST_CATEGORY_LABELS } from "@/types/worship";
import type { PlaylistModel } from "@/models/playlist";

export function PlaylistCard({
  playlists,
  error = false,
}: {
  playlists: PlaylistModel[];
  error?: boolean;
}) {
  const playlist = playlists[0] ?? null;
  const songs = playlist
    ? [...playlist.songs].sort((a, b) => a.order - b.order)
    : [];

  return (
    <SectionCard title="찬양 플레이리스트" description={playlist?.name}>
      {error ? (
        <SectionError message="플레이리스트를 불러오지 못했습니다" />
      ) : songs.length === 0 ? (
        <EmptyState icon={Music} title="등록된 찬양이 없습니다" />
      ) : (
        <div className="space-y-3">
          <div>
            <Badge color="#2563EB">{playlist ? WORSHIP_PLAYLIST_CATEGORY_LABELS[playlist.category] : "예배"}</Badge>
          </div>
          <ul className="space-y-2">
            {songs.map((song) => {
              const content = (
                <>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                    <Play className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#171717] dark:text-[#f5f5f5]">{song.title}</p>
                    {song.artist && <p className="truncate text-xs text-[#a3a3a3]">{song.artist}</p>}
                  </div>
                </>
              );
              const className = "flex items-center gap-3 rounded-xl border border-[#e5e5e5] p-2.5 dark:border-[#2c2c2e]";
              return (
                <li key={song.id}>
                  {song.youtubeUrl ? (
                    <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer" className={`${className} transition-colors hover:bg-[#fafafa] dark:hover:bg-[#262626]`}>
                      {content}
                    </a>
                  ) : (
                    <div className={className}>{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </SectionCard>
  );
}
