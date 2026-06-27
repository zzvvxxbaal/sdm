/**
 * QT (Quiet Time) Service
 * Manages daily devotion journal entries.
 */

import { db } from "@/firebase/config";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type QueryConstraint,
} from "firebase/firestore";
import type { QTEntry, QTEntryInput } from "@/types/qt";

const QT_COLLECTION = "qt_entries";

export async function createQTEntry(userId: string, data: QTEntryInput): Promise<string> {
  const docRef = await addDoc(collection(db, QT_COLLECTION), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateQTEntry(
  entryId: string,
  data: Partial<QTEntryInput>
): Promise<void> {
  const docRef = doc(db, QT_COLLECTION, entryId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteQTEntry(entryId: string): Promise<void> {
  await deleteDoc(doc(db, QT_COLLECTION, entryId));
}

export async function getQTEntry(entryId: string): Promise<QTEntry | null> {
  const docRef = doc(db, QT_COLLECTION, entryId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as QTEntry;
}

export async function getUserQTEntries(
  userId: string,
  options?: { limit?: number; order?: "asc" | "desc" }
): Promise<QTEntry[]> {
  const q = query(
    collection(db, QT_COLLECTION),
    where("userId", "==", userId),
    orderBy("date", options?.order || "desc"),
    ...(options?.limit ? [limit(options.limit)] : [])
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as QTEntry);
}

export async function getQTEntryByDate(
  userId: string,
  date: string // YYYY-MM-DD
): Promise<QTEntry | null> {
  const q = query(
    collection(db, QT_COLLECTION),
    where("userId", "==", userId),
    where("date", "==", date),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as QTEntry;
}

export async function getQTEntriesByDateRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<QTEntry[]> {
  const q = query(
    collection(db, QT_COLLECTION),
    where("userId", "==", userId),
    where("date", ">=", startDate),
    where("date", "<=", endDate),
    orderBy("date", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as QTEntry);
}

export async function getUserQTEntriesWithLimit(
  userId: string,
  options?: { limit?: number; order?: "asc" | "desc" }
): Promise<QTEntry[]> {
  const constraints: QueryConstraint[] = [
    where("userId", "==", userId),
    orderBy("date", options?.order || "desc"),
  ];
  if (options?.limit) {
    constraints.push(limit(options.limit));
  }
  const q = query(collection(db, QT_COLLECTION), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as QTEntry);
}
