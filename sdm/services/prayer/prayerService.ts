/**
 * Prayer Service
 * Manages prayer requests and community prayers.
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
import { COLLECTIONS } from "@/constants/collections";
import type { PrayerRequestModel } from "@/models/prayer_request";

/**
 * Creates a new prayer request
 */
export async function createPrayer(
  uid: string,
  data: Omit<PrayerRequestModel, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.PRAYER_REQUESTS), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: uid,
    updatedBy: uid,
  });
  return docRef.id;
}

/**
 * Gets all active prayers (not answered)
 */
export async function getPrayers(
  options?: { limit?: number; includeAnswered?: boolean }
): Promise<(PrayerRequestModel & { id: string })[]> {
  const constraints: QueryConstraint[] = [
    where("isActive", "==", true),
    orderBy("createdAt", "desc"),
  ];

  if (!options?.includeAnswered) {
    constraints.push(where("isAnswered", "==", false));
  }

  if (options?.limit) {
    constraints.push(limit(options.limit));
  }

  const q = query(collection(db, COLLECTIONS.PRAYER_REQUESTS), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PrayerRequestModel & { id: string }));
}

/**
 * Gets all prayers for a specific user
 */
export async function getUserPrayers(
  uid: string,
  options?: { limit?: number }
): Promise<(PrayerRequestModel & { id: string })[]> {
  const constraints: QueryConstraint[] = [
    where("createdBy", "==", uid),
    where("isActive", "==", true),
    orderBy("createdAt", "desc"),
  ];

  if (options?.limit) {
    constraints.push(limit(options.limit));
  }

  const q = query(collection(db, COLLECTIONS.PRAYER_REQUESTS), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PrayerRequestModel & { id: string }));
}

/**
 * Gets a single prayer by ID
 */
export async function getPrayerById(
  prayerId: string
): Promise<(PrayerRequestModel & { id: string }) | null> {
  const docRef = doc(db, COLLECTIONS.PRAYER_REQUESTS, prayerId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as PrayerRequestModel & { id: string };
}

/**
 * Marks a prayer as answered
 */
export async function markAsAnswered(prayerId: string, uid: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PRAYER_REQUESTS, prayerId);
  await updateDoc(docRef, {
    isAnswered: true,
    answeredAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
}

/**
 * Marks a prayer as unanswered
 */
export async function markAsUnanswered(prayerId: string, uid: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PRAYER_REQUESTS, prayerId);
  await updateDoc(docRef, {
    isAnswered: false,
    answeredAt: null,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
}

/**
 * Updates a prayer
 */
export async function updatePrayer(
  prayerId: string,
  data: Partial<Omit<PrayerRequestModel, "id" | "createdAt" | "createdBy">>,
  uid: string
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PRAYER_REQUESTS, prayerId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
}

/**
 * Soft deletes a prayer (sets isActive to false)
 */
export async function deletePrayer(prayerId: string, uid: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PRAYER_REQUESTS, prayerId);
  await updateDoc(docRef, {
    isActive: false,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
}

/**
 * Permanently deletes a prayer (for admin only)
 */
export async function permanentlyDeletePrayer(prayerId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.PRAYER_REQUESTS, prayerId));
}

/**
 * Increments prayer count (when someone prays for it)
 */
export async function incrementPrayerCount(prayerId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PRAYER_REQUESTS, prayerId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    const currentCount = (snap.data() as any).prayerCount ?? 0;
    await updateDoc(docRef, {
      prayerCount: currentCount + 1,
      updatedAt: serverTimestamp(),
    });
  }
}

/**
 * Gets answered prayers (for stats/archive)
 */
export async function getAnsweredPrayers(
  options?: { limit?: number }
): Promise<(PrayerRequestModel & { id: string })[]> {
  const constraints: QueryConstraint[] = [
    where("isAnswered", "==", true),
    where("isActive", "==", true),
    orderBy("answeredAt", "desc"),
  ];

  if (options?.limit) {
    constraints.push(limit(options.limit));
  }

  const q = query(collection(db, COLLECTIONS.PRAYER_REQUESTS), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PrayerRequestModel & { id: string }));
}
