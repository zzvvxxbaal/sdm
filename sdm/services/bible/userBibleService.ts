import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { COLLECTIONS } from "@/constants/collections";
import type { BibleReadingHistory, BibleVerse } from "@/types/bible";

const FAVORITES = COLLECTIONS.BIBLE_FAVORITES;
const HISTORY = COLLECTIONS.BIBLE_HISTORY;

function favoriteDocId(userId: string, verseId: string) {
  return `${userId}_${verseId}`;
}

export async function listBibleFavorites(userId: string) {
  const snapshot = await getDocs(
    query(collection(db, FAVORITES), where("userId", "==", userId), orderBy("createdAt", "desc"), limit(30)),
  );
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function toggleBibleFavorite(userId: string, verse: BibleVerse, isFavorite: boolean) {
  const ref = doc(db, FAVORITES, favoriteDocId(userId, verse.id));
  if (isFavorite) {
    await deleteDoc(ref);
    return;
  }
  await updateDoc(ref, {}).catch(async () => {
    await addDoc(collection(db, FAVORITES), {
      userId,
      verseId: verse.id,
      bookId: verse.bookId,
      bookName: verse.bookName,
      chapterNumber: verse.chapterNumber,
      verseNumber: verse.verseNumber,
      text: verse.text,
      createdAt: serverTimestamp(),
    });
  });
}

export async function recordBibleHistory(userId: string, verse: BibleVerse) {
  const snapshot = await getDocs(
    query(collection(db, HISTORY), where("userId", "==", userId), where("verseId", "==", verse.id), limit(1)),
  );
  if (!snapshot.empty) {
    await updateDoc(snapshot.docs[0].ref, { viewedAt: serverTimestamp() });
    return;
  }
  await addDoc(collection(db, HISTORY), {
    userId,
    verseId: verse.id,
    bookId: verse.bookId,
    bookName: verse.bookName,
    chapterNumber: verse.chapterNumber,
    verseNumber: verse.verseNumber,
    viewedAt: serverTimestamp(),
  } satisfies Omit<BibleReadingHistory, "id">);
}

export async function listBibleHistory(userId: string) {
  const snapshot = await getDocs(
    query(collection(db, HISTORY), where("userId", "==", userId), orderBy("viewedAt", "desc"), limit(12)),
  );
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}
