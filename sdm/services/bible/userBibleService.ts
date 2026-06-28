import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { COLLECTIONS } from "@/constants/collections";
import type { BibleVerse } from "@/types/bible";

const FAVORITES = COLLECTIONS.BIBLE_FAVORITES;
const HISTORY = COLLECTIONS.BIBLE_HISTORY;
const FAVORITES_LIMIT = 30;
const HISTORY_LIMIT = 12;

function favoriteDocId(userId: string, verseId: string) {
  return `${userId}_${verseId}`;
}

function historyDocId(userId: string, verseId: string) {
  return `${userId}_${verseId}`;
}

export async function listBibleFavorites(userId: string) {
  const snapshot = await getDocs(
    query(
      collection(db, FAVORITES),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(FAVORITES_LIMIT),
    ),
  );
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function toggleBibleFavorite(userId: string, verse: BibleVerse, isFavorite: boolean) {
  const ref = doc(db, FAVORITES, favoriteDocId(userId, verse.id));
  if (isFavorite) {
    await deleteDoc(ref);
    return;
  }
  await setDoc(ref, {
    userId,
    verseId: verse.id,
    bookId: verse.bookId,
    bookName: verse.bookName,
    chapterNumber: verse.chapterNumber,
    verseNumber: verse.verseNumber,
    text: verse.text,
    createdAt: serverTimestamp(),
  });
}

export async function recordBibleHistory(userId: string, verse: BibleVerse) {
  await setDoc(doc(db, HISTORY, historyDocId(userId, verse.id)), {
    userId,
    verseId: verse.id,
    bookId: verse.bookId,
    bookName: verse.bookName,
    chapterNumber: verse.chapterNumber,
    verseNumber: verse.verseNumber,
    viewedAt: serverTimestamp(),
  });
}

export async function listBibleHistory(userId: string) {
  const snapshot = await getDocs(
    query(
      collection(db, HISTORY),
      where("userId", "==", userId),
      orderBy("viewedAt", "desc"),
      limit(HISTORY_LIMIT),
    ),
  );
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}
