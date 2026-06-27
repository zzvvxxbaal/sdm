import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/firebase/config";
import { COLLECTIONS } from "@/constants/collections";
import { playlistConverter, type PlaylistModel, type PlaylistSong } from "@/models/playlist";

const ref = collection(db, COLLECTIONS.PLAYLISTS).withConverter(playlistConverter);

export async function getAllPlaylists(): Promise<PlaylistModel[]> {
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as PlaylistModel);
}

export interface PlaylistInput {
  name: string;
  category: PlaylistModel["category"];
  songs: PlaylistSong[];
}

export async function createPlaylist(data: PlaylistInput, authorId: string): Promise<string> {
  const now = serverTimestamp();
  const docRef = await addDoc(collection(db, COLLECTIONS.PLAYLISTS), {
    ...data,
    description: null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    createdBy: authorId,
    updatedBy: authorId,
  });
  return docRef.id;
}

export async function updatePlaylist(
  id: string,
  data: Partial<PlaylistInput>,
  authorId: string,
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.PLAYLISTS, id), {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: authorId,
  });
}

export async function deletePlaylist(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.PLAYLISTS, id));
}
