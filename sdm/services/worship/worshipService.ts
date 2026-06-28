import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/config";
import { COLLECTIONS } from "@/constants/collections";
import { playlistConverter, type PlaylistModel, type PlaylistSong } from "@/models/playlist";
import type { WorshipFavoriteModel } from "@/types/worship";

const playlistRef = collection(db, COLLECTIONS.PLAYLISTS).withConverter(playlistConverter);

export interface WorshipPlaylistInput {
  name: string;
  category: PlaylistModel["category"];
  description?: string | null;
  songs: PlaylistSong[];
}

export async function getAllWorshipPlaylists(): Promise<PlaylistModel[]> {
  const snapshot = await getDocs(
    query(playlistRef, where("isActive", "==", true), orderBy("createdAt", "desc")),
  );
  return snapshot.docs.map((entry) => ({ ...entry.data(), id: entry.id }) as PlaylistModel);
}

export async function getWorshipPlaylistById(id: string): Promise<PlaylistModel | null> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.PLAYLISTS, id).withConverter(playlistConverter));
  if (!snapshot.exists()) return null;
  return { ...snapshot.data(), id: snapshot.id } as PlaylistModel;
}

export async function createWorshipPlaylist(
  data: WorshipPlaylistInput,
  authorId: string,
): Promise<string> {
  const now = serverTimestamp();
  const docRef = await addDoc(collection(db, COLLECTIONS.PLAYLISTS), {
    ...data,
    description: data.description ?? null,
    favoriteCount: 0,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    createdBy: authorId,
    updatedBy: authorId,
  });
  return docRef.id;
}

export async function updateWorshipPlaylist(
  id: string,
  data: Partial<WorshipPlaylistInput>,
  authorId: string,
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.PLAYLISTS, id), {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: authorId,
  });
}

export async function deleteWorshipPlaylist(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.PLAYLISTS, id));
}

export async function getFavoriteSongs(userId: string): Promise<WorshipFavoriteModel[]> {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.WORSHIP_FAVORITES),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    ),
  );
  return snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as Omit<WorshipFavoriteModel, "id">) }));
}

export async function getFavoriteSongIds(userId: string) {
  const favorites = await getFavoriteSongs(userId);
  return new Set(favorites.map((item) => `${item.playlistId}:${item.songId}`));
}

export async function toggleFavoriteSong(
  userId: string,
  playlist: PlaylistModel,
  song: PlaylistSong,
): Promise<boolean> {
  const favoriteId = `${userId}_${playlist.id}_${song.id}`;
  const favoriteRef = doc(db, COLLECTIONS.WORSHIP_FAVORITES, favoriteId);
  const snapshot = await getDoc(favoriteRef);

  if (snapshot.exists()) {
    await deleteDoc(favoriteRef);
    await updateDoc(doc(db, COLLECTIONS.PLAYLISTS, playlist.id), {
      favoriteCount: Math.max(0, (playlist.favoriteCount ?? 1) - 1),
      updatedAt: serverTimestamp(),
      updatedBy: userId,
    });
    return false;
  }

  await setDoc(favoriteRef, {
    userId,
    playlistId: playlist.id,
    songId: song.id,
    songTitle: song.title,
    artist: song.artist,
    youtubeUrl: song.youtubeUrl,
    category: playlist.category,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await updateDoc(doc(db, COLLECTIONS.PLAYLISTS, playlist.id), {
    favoriteCount: (playlist.favoriteCount ?? 0) + 1,
    updatedAt: serverTimestamp(),
    updatedBy: userId,
  });
  return true;
}
