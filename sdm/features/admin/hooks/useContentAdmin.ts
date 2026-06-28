"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/features/auth";
import {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getAllBulletins,
  createBulletin,
  updateBulletin,
  deleteBulletin,
  getAllPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
} from "@/services/content";
import type { AnnouncementModel } from "@/models/announcement";
import type { EventModel } from "@/models/event";
import type { BulletinModel } from "@/models/bulletin";
import type { PlaylistModel } from "@/models/playlist";

/**
 * Generic admin list controller shared by every content entity. Each public
 * hook wires it to the matching service so callers stay tiny and consistent.
 */
function useCrudList<TItem, TInput>(
  fetchAll: () => Promise<TItem[]>,
  create: (data: TInput, uid: string) => Promise<string>,
  update: (id: string, data: Partial<TInput>, uid: string) => Promise<void>,
  remove: (id: string) => Promise<void>,
) {
  const { user } = useAuth();
  const [items, setItems] = useState<TItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setItems(await fetchAll());
    } catch {
      setError("목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchAll]);

  useEffect(() => {
    let isMounted = true;
    void (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAll();
        if (isMounted) setItems(data);
      } catch {
        if (isMounted) setError("목록을 불러오지 못했습니다.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [fetchAll]);

  const save = useCallback(
    async (data: TInput, id?: string) => {
      if (!user) return;
      if (id) await update(id, data, user.uid);
      else await create(data, user.uid);
      await load();
    },
    [user, load, create, update],
  );

  const removeItem = useCallback(
    async (id: string) => {
      await remove(id);
      await load();
    },
    [load, remove],
  );

  return { items, isLoading, error, save, remove: removeItem, reload: load };
}

export function useAnnouncementAdmin() {
  return useCrudList<AnnouncementModel, Parameters<typeof createAnnouncement>[0]>(
    getAllAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  );
}

export function useEventAdmin() {
  return useCrudList<EventModel, Parameters<typeof createEvent>[0]>(
    getAllEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  );
}

export function useBulletinAdmin() {
  return useCrudList<BulletinModel, Parameters<typeof createBulletin>[0]>(
    getAllBulletins,
    createBulletin,
    updateBulletin,
    deleteBulletin,
  );
}

export function usePlaylistAdmin() {
  return useCrudList<PlaylistModel, Parameters<typeof createPlaylist>[0]>(
    getAllPlaylists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
  );
}
