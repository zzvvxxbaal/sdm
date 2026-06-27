"use client";

import { useEffect, useMemo, useState } from "react";

import {
  createWorshipPlaylist,
  deleteWorshipPlaylist,
  getAllWorshipPlaylists,
  getFavoriteSongIds,
  getFavoriteSongs,
  toggleFavoriteSong,
  updateWorshipPlaylist,
  type WorshipPlaylistInput,
} from "@/services/worship";
import type { PlaylistModel, PlaylistSong } from "@/models/playlist";
import type { WorshipFavoriteModel } from "@/types/worship";

export function useWorshipBoard(userId?: string | null, category?: PlaylistModel["category"] | "all") {
  const [playlists, setPlaylists] = useState<PlaylistModel[]>([]);
  const [favorites, setFavorites] = useState<WorshipFavoriteModel[]>([]);
  const [favoriteSongIds, setFavoriteSongIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const nextPlaylists = await getAllWorshipPlaylists();
      setPlaylists(nextPlaylists);
      if (userId) {
        const [favoriteList, favoriteIds] = await Promise.all([
          getFavoriteSongs(userId),
          getFavoriteSongIds(userId),
        ]);
        setFavorites(favoriteList);
        setFavoriteSongIds(favoriteIds);
      } else {
        setFavorites([]);
        setFavoriteSongIds(new Set());
      }
    } catch {
      setError("찬양 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const nextPlaylists = await getAllWorshipPlaylists();
        if (!active) return;
        setPlaylists(nextPlaylists);
        if (userId) {
          const [favoriteList, favoriteIds] = await Promise.all([
            getFavoriteSongs(userId),
            getFavoriteSongIds(userId),
          ]);
          if (!active) return;
          setFavorites(favoriteList);
          setFavoriteSongIds(favoriteIds);
        } else {
          setFavorites([]);
          setFavoriteSongIds(new Set());
        }
      } catch {
        if (active) setError("찬양 데이터를 불러오지 못했습니다.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [userId]);

  const filteredPlaylists = useMemo(() => {
    if (!category || category === "all") return playlists;
    return playlists.filter((item) => item.category === category);
  }, [playlists, category]);

  const savePlaylist = async (input: WorshipPlaylistInput, authorId: string, id?: string) => {
    if (id) await updateWorshipPlaylist(id, input, authorId);
    else await createWorshipPlaylist(input, authorId);
    await reload();
  };

  const removePlaylist = async (id: string) => {
    await deleteWorshipPlaylist(id);
    await reload();
  };

  const toggleFavorite = async (playlist: PlaylistModel, song: PlaylistSong) => {
    if (!userId) return;
    await toggleFavoriteSong(userId, playlist, song);
    await reload();
  };

  return { playlists: filteredPlaylists, favorites, favoriteSongIds, loading, error, savePlaylist, removePlaylist, toggleFavorite, reload };
}
