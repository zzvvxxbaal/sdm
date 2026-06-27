export const WORSHIP_PLAYLIST_CATEGORIES = ["worship", "qt_music", "personal_devotion"] as const;

export type WorshipPlaylistCategory = (typeof WORSHIP_PLAYLIST_CATEGORIES)[number];

export const WORSHIP_PLAYLIST_CATEGORY_LABELS: Record<WorshipPlaylistCategory, string> = {
  worship: "예배",
  qt_music: "QT 음악",
  personal_devotion: "개인 경건",
};

export interface WorshipFavoriteModel {
  id: string;
  userId: string;
  playlistId: string;
  songId: string;
  songTitle: string;
  artist: string | null;
  youtubeUrl: string | null;
  category: WorshipPlaylistCategory;
  createdAt: unknown;
  updatedAt: unknown;
}
