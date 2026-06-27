import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, increment, limit, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { COLLECTIONS } from "@/constants/collections";
import type { UserProfile } from "@/types/user";
import type { QTEntry, QTEntryInput, QTQueryFilters } from "@/types/qt";
import { buildCalendarDays, buildMonthlySummary, buildSearchTokens, buildWeeklySummary, filterEntries, getMonthKey, normalizeDateKey } from "@/features/qt/lib/qt-utils";

const QT_COLLECTION = COLLECTIONS.QT_ENTRIES;

function userDoc(userId: string) {
  return doc(db, COLLECTIONS.USERS, userId);
}

function toPayload(profile: UserProfile, input: QTEntryInput) {
  const dateKey = normalizeDateKey(input.entryDate);
  return {
    ...input,
    userName: profile.displayName ?? "이름 없음",
    teamId: profile.teamId ?? null,
    cellId: profile.cellId ?? null,
    entryDate: input.entryDate,
    dateKey,
    monthKey: getMonthKey(dateKey),
    searchTokens: buildSearchTokens({ ...input }),
  };
}

async function queryMonthEntries(userId: string, monthKey: string, rowLimit?: number) {
  const snapshot = await getDocs(
    query(
      collection(db, QT_COLLECTION),
      where("userId", "==", userId),
      where("monthKey", "==", monthKey),
      orderBy("entryDate", "desc"),
      ...(rowLimit ? [limit(rowLimit)] : []),
    ),
  );
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as QTEntry);
}

export async function createQTEntry(profile: UserProfile, input: QTEntryInput) {
  const docRef = await addDoc(collection(db, QT_COLLECTION), {
    ...toPayload(profile, input),
    userId: profile.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await updateDoc(userDoc(profile.uid), {
    "statistics.qtCount": increment(1),
    updatedAt: new Date().toISOString(),
  }).catch((error: unknown) => {
    console.error(`QT 통계 업데이트에 실패했습니다. userId=${profile.uid}`, error);
  });
  return docRef.id;
}

export async function updateQTEntry(entryId: string, profile: UserProfile, input: QTEntryInput) {
  await updateDoc(doc(db, QT_COLLECTION, entryId), {
    ...toPayload(profile, input),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteQTEntry(entryId: string, userId: string) {
  await deleteDoc(doc(db, QT_COLLECTION, entryId));
  await updateDoc(userDoc(userId), {
    "statistics.qtCount": increment(-1),
    updatedAt: new Date().toISOString(),
  }).catch((error: unknown) => {
    console.error(`QT 통계 롤백에 실패했습니다. entryId=${entryId} userId=${userId}`, error);
  });
}

export async function getQTEntry(entryId: string) {
  const snapshot = await getDoc(doc(db, QT_COLLECTION, entryId));
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as QTEntry) : null;
}

export async function getUserQTEntries(userId: string, filters: QTQueryFilters) {
  const monthKey = filters.monthKey ?? getMonthKey(new Date());
  const entries = await queryMonthEntries(userId, monthKey, filters.limit);
  return filterEntries(entries, filters);
}

export async function getUserQTEntriesWithLimit(
  userId: string,
  options?: { limit?: number },
) {
  const monthKey = getMonthKey(new Date());
  return queryMonthEntries(userId, monthKey, options?.limit);
}

export async function toggleQTFavorite(entryId: string, isFavorite: boolean) {
  await updateDoc(doc(db, QT_COLLECTION, entryId), { isFavorite: !isFavorite, updatedAt: serverTimestamp() });
}

export async function toggleQTArchive(entryId: string, isArchived: boolean) {
  await updateDoc(doc(db, QT_COLLECTION, entryId), { isArchived: !isArchived, updatedAt: serverTimestamp() });
}

export async function getQTCalendar(userId: string, year: number, month: number) {
  const entries = await queryMonthEntries(userId, `${year}-${String(month).padStart(2, "0")}`);
  return buildCalendarDays(entries, year, month);
}

export async function getQTMonthlySummary(userId: string, year: number, month: number) {
  const entries = await queryMonthEntries(userId, `${year}-${String(month).padStart(2, "0")}`);
  return buildMonthlySummary(entries, year, month);
}

export async function getQTWeeklySummary(userId: string, anchorDate: Date) {
  const monthEntries = await queryMonthEntries(userId, getMonthKey(anchorDate));
  return buildWeeklySummary(monthEntries, anchorDate);
}
