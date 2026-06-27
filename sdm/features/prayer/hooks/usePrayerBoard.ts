"use client";

import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/features/auth";
import {
  addPrayerComment,
  createPrayerRequest,
  deletePrayerComment,
  deletePrayerRequest,
  getPrayerComments,
  getPrayerLikeMap,
  getPrayerRequestById,
  getVisiblePrayerRequests,
  setPrayerAnswered,
  togglePrayerLike,
  togglePrayerPinned,
  updatePrayerRequest,
} from "@/services/prayer";
import type { PrayerRequestInput } from "@/services/prayer";
import type { PrayerRequestModel } from "@/models/prayer_request";
import type { PrayerCommentModel } from "@/types/prayer";

export function usePrayerBoard(searchTerm: string) {
  const { user } = useAuth();
  const [prayers, setPrayers] = useState<PrayerRequestModel[]>([]);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const viewer = useMemo(() => (user ? {
    uid: user.uid,
    role: user.role,
    teamId: user.teamId,
    cellId: user.cellId,
  } : null), [user]);

  const reload = async () => {
    if (!viewer) return;
    setLoading(true);
    setError(null);
    try {
      const nextPrayers = await getVisiblePrayerRequests(viewer, searchTerm);
      setPrayers(nextPrayers);
      setLikedMap(await getPrayerLikeMap(nextPrayers.map((item) => item.id), viewer.uid));
    } catch {
      setError("기도제목을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!viewer) return;
    let active = true;
    void (async () => {
      try {
        const nextPrayers = await getVisiblePrayerRequests(viewer, searchTerm);
        const nextLiked = await getPrayerLikeMap(nextPrayers.map((item) => item.id), viewer.uid);
        if (!active) return;
        setPrayers(nextPrayers);
        setLikedMap(nextLiked);
      } catch {
        if (active) setError("기도제목을 불러오지 못했습니다.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [viewer, searchTerm]);

  if (!viewer) {
    return {
      prayers: [],
      likedMap: {},
      loading: false,
      error,
      savePrayer: async () => {},
      removePrayer: async () => {},
      likePrayer: async () => {},
      pinPrayer: async () => {},
      answerPrayer: async () => {},
      reload: async () => {},
    };
  }

  const savePrayer = async (input: PrayerRequestInput, id?: string) => {
    if (!user) return;
    const author = {
      uid: user.uid,
      displayName: user.displayName,
      role: user.role,
      teamId: user.teamId,
      cellId: user.cellId,
    };
    if (id) await updatePrayerRequest(id, input, author);
    else await createPrayerRequest(input, author);
    await reload();
  };

  const removePrayer = async (id: string) => {
    await deletePrayerRequest(id);
    await reload();
  };

  const likePrayer = async (id: string) => {
    await togglePrayerLike(id, viewer.uid);
    await reload();
  };

  const pinPrayer = async (prayer: PrayerRequestModel) => {
    await togglePrayerPinned(prayer.id, !prayer.isPinned, viewer.uid);
    await reload();
  };

  const answerPrayer = async (prayer: PrayerRequestModel, answered: boolean) => {
    await setPrayerAnswered(prayer.id, answered, viewer.uid);
    await reload();
  };

  return {
    prayers,
    likedMap,
    loading,
    error,
    savePrayer,
    removePrayer,
    likePrayer,
    pinPrayer,
    answerPrayer,
    reload,
  };
}

export function usePrayerDetail(prayerId: string) {
  const { user } = useAuth();
  const [prayer, setPrayer] = useState<PrayerRequestModel | null>(null);
  const [comments, setComments] = useState<PrayerCommentModel[]>([]);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [nextPrayer, nextComments, nextLiked] = await Promise.all([
        getPrayerRequestById(prayerId),
        getPrayerComments(prayerId),
        getPrayerLikeMap([prayerId], user.uid),
      ]);
      setPrayer(nextPrayer);
      setComments(nextComments);
      setLiked(Boolean(nextLiked[prayerId]));
    } catch {
      setError("기도제목을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    let active = true;
    void (async () => {
      try {
        const [nextPrayer, nextComments, nextLiked] = await Promise.all([
          getPrayerRequestById(prayerId),
          getPrayerComments(prayerId),
          getPrayerLikeMap([prayerId], user.uid),
        ]);
        if (!active) return;
        setPrayer(nextPrayer);
        setComments(nextComments);
        setLiked(Boolean(nextLiked[prayerId]));
      } catch {
        if (active) setError("기도제목을 불러오지 못했습니다.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [prayerId, user]);

  if (!user) {
    return {
      prayer: null,
      comments: [],
      liked: false,
      loading: false,
      error,
      addComment: async () => {},
      removeComment: async () => {},
      likePrayer: async () => {},
      reload: async () => {},
    };
  }

  const addComment = async (input: { content: string; isAnonymous: boolean }) => {
    await addPrayerComment(prayerId, input, {
      uid: user.uid,
      displayName: user.displayName,
      role: user.role,
      teamId: user.teamId,
      cellId: user.cellId,
    });
    await reload();
  };

  const removeComment = async (commentId: string) => {
    await deletePrayerComment(prayerId, commentId, user.uid);
    await reload();
  };

  const likePrayer = async () => {
    await togglePrayerLike(prayerId, user.uid);
    await reload();
  };

  return { prayer, comments, liked, loading, error, addComment, removeComment, likePrayer, reload };
}
