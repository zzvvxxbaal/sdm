import { z } from "zod";
import type { FirestoreBase } from "@/types/firestore";
import type { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { WORSHIP_PLAYLIST_CATEGORIES, type WorshipPlaylistCategory } from "@/types/worship";

export const playlistSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().nullable().optional(),
  songs: z.array(
    z.object({
      id: z.string(),
      title: z.string().min(1),
      artist: z.string().nullable().optional(),
      youtubeUrl: z.string().url().nullable().optional(),
      lyrics: z.string().nullable().optional(),
      chordSheet: z.string().nullable().optional(),
      order: z.number().int().min(0),
    })
  ).default([]),
  category: z.enum(WORSHIP_PLAYLIST_CATEGORIES).default("worship"),
  favoriteCount: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  createdAt: z.any(),
  updatedAt: z.any(),
  createdBy: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export type Playlist = z.infer<typeof playlistSchema>;

export interface PlaylistSong {
  id: string;
  title: string;
  artist: string | null;
  youtubeUrl: string | null;
  lyrics: string | null;
  chordSheet: string | null;
  order: number;
}

export interface PlaylistModel extends FirestoreBase {
  name: string;
  description: string | null;
  songs: PlaylistSong[];
  category: WorshipPlaylistCategory;
  favoriteCount: number;
  isActive: boolean;
}

export const playlistConverter = {
  toFirestore(playlist: Omit<PlaylistModel, "id">): Record<string, unknown> {
    return {
      name: playlist.name,
      description: playlist.description,
      songs: playlist.songs,
      category: playlist.category,
      favoriteCount: playlist.favoriteCount,
      isActive: playlist.isActive,
      createdAt: playlist.createdAt,
      updatedAt: playlist.updatedAt,
      createdBy: playlist.createdBy,
      updatedBy: playlist.updatedBy,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions,
  ): Omit<PlaylistModel, "id"> {
    const data = snapshot.data(options);
    return {
      name: data.name as string,
      description: (data.description as string) ?? null,
      songs: (data.songs as PlaylistSong[]) ?? [],
      category: (data.category as WorshipPlaylistCategory) ?? "worship",
      favoriteCount: (data.favoriteCount as number) ?? 0,
      isActive: (data.isActive as boolean) ?? true,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: (data.createdBy as string) ?? null,
      updatedBy: (data.updatedBy as string) ?? null,
    };
  },
};
