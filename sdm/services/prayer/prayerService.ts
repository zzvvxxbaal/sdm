import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/config";
import { COLLECTIONS } from "@/constants/collections";
import { prayerRequestConverter, type PrayerRequestModel } from "@/models/prayer_request";
import type { PrayerAuthorContext, PrayerCommentModel, PrayerViewerContext } from "@/types/prayer";
import { buildSearchTokens } from "@/lib/text/buildSearchTokens";
import { isLeader, UserRole } from "@/types";
import { toMillis } from "@/lib/date";

const prayerRef = collection(db, COLLECTIONS.PRAYER_REQUESTS).withConverter(prayerRequestConverter);

function mergeAndSortPrayers(collections: PrayerRequestModel[][]) {
  const byId = new Map<string, PrayerRequestModel>();
  collections.flat().forEach((item) => {
    byId.set(item.id, item);
  });

  return Array.from(byId.values()).sort((left, right) => {
    if (left.isPinned !== right.isPinned) {
      return Number(right.isPinned) - Number(left.isPinned);
    }
    return toMillis(right.createdAt) - toMillis(left.createdAt);
  });
}

function toPrayerArray(snapshot: { docs: Array<{ id: string; data: () => Omit<PrayerRequestModel, "id"> }> }) {
  return snapshot.docs.map((entry) => ({ ...entry.data(), id: entry.id }) as PrayerRequestModel);
}

export interface PrayerRequestInput {
  title: string;
  content: string;
  category: PrayerRequestModel["category"];
  visibility: PrayerRequestModel["visibility"];
  isAnonymous: boolean;
}

export interface PrayerCommentInput {
  content: string;
  isAnonymous: boolean;
}

export async function getVisiblePrayerRequests(
  viewer: PrayerViewerContext,
  searchTerm?: string,
): Promise<PrayerRequestModel[]> {
  const requests: Promise<PrayerRequestModel[]>[] = [
    getDocs(
      query(
        prayerRef,
        where("isActive", "==", true),
        where("visibility", "==", "church"),
        orderBy("createdAt", "desc"),
        limit(50),
      ),
    ).then((snapshot) => toPrayerArray(snapshot)),
    getDocs(
      query(
        prayerRef,
        where("isActive", "==", true),
        where("visibility", "==", "private"),
        where("createdBy", "==", viewer.uid),
        orderBy("createdAt", "desc"),
        limit(50),
      ),
    ).then((snapshot) => toPrayerArray(snapshot)),
  ];

  if (viewer.teamId) {
    requests.push(
      getDocs(
        query(
          prayerRef,
          where("isActive", "==", true),
          where("visibility", "==", "team"),
          where("teamId", "==", viewer.teamId),
          orderBy("createdAt", "desc"),
          limit(50),
        ),
      ).then((snapshot) => toPrayerArray(snapshot)),
    );
  }

  if (viewer.cellId) {
    requests.push(
      getDocs(
        query(
          prayerRef,
          where("isActive", "==", true),
          where("visibility", "==", "cell"),
          where("cellId", "==", viewer.cellId),
          orderBy("createdAt", "desc"),
          limit(50),
        ),
      ).then((snapshot) => toPrayerArray(snapshot)),
    );
  }

  if (isLeader(viewer.role as UserRole)) {
    requests.push(
      getDocs(
        query(
          prayerRef,
          where("isActive", "==", true),
          where("visibility", "==", "leaders"),
          orderBy("createdAt", "desc"),
          limit(50),
        ),
      ).then((snapshot) => toPrayerArray(snapshot)),
    );
  } else {
    requests.push(
      getDocs(
        query(
          prayerRef,
          where("isActive", "==", true),
          where("visibility", "==", "leaders"),
          where("createdBy", "==", viewer.uid),
          orderBy("createdAt", "desc"),
          limit(50),
        ),
      ).then((snapshot) => toPrayerArray(snapshot)),
    );
  }

  const merged = mergeAndSortPrayers(await Promise.all(requests));
  const keyword = searchTerm?.trim().toLowerCase();
  if (!keyword) return merged;
  return merged.filter((item) => item.searchTokens.some((token) => token.includes(keyword)));
}

export async function getPrayerRequestById(id: string): Promise<PrayerRequestModel | null> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.PRAYER_REQUESTS, id).withConverter(prayerRequestConverter));
  if (!snapshot.exists()) return null;
  return { ...snapshot.data(), id: snapshot.id } as PrayerRequestModel;
}

export async function createPrayerRequest(
  data: PrayerRequestInput,
  author: PrayerAuthorContext,
): Promise<string> {
  const now = serverTimestamp();
  const payload = {
    ...data,
    teamId: data.visibility === "team" ? author.teamId : null,
    cellId: data.visibility === "cell" ? author.cellId : null,
    authorName: data.isAnonymous ? null : author.displayName,
    prayerCount: 0,
    commentCount: 0,
    isPinned: false,
    isAnswered: false,
    answeredAt: null,
    searchTokens: buildSearchTokens(data.title, data.content, author.displayName),
    isActive: true,
    createdAt: now,
    updatedAt: now,
    createdBy: author.uid,
    updatedBy: author.uid,
  };
  const docRef = await addDoc(collection(db, COLLECTIONS.PRAYER_REQUESTS), payload);
  return docRef.id;
}

export async function updatePrayerRequest(
  id: string,
  data: PrayerRequestInput,
  author: PrayerAuthorContext,
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.PRAYER_REQUESTS, id), {
    ...data,
    teamId: data.visibility === "team" ? author.teamId : null,
    cellId: data.visibility === "cell" ? author.cellId : null,
    authorName: data.isAnonymous ? null : author.displayName,
    searchTokens: buildSearchTokens(data.title, data.content, author.displayName),
    updatedAt: serverTimestamp(),
    updatedBy: author.uid,
  });
}

export async function deletePrayerRequest(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.PRAYER_REQUESTS, id));
}

export async function togglePrayerPinned(id: string, pinned: boolean, userId: string): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.PRAYER_REQUESTS, id), {
    isPinned: pinned,
    updatedAt: serverTimestamp(),
    updatedBy: userId,
  });
}

function prayerCommentsRef(prayerId: string) {
  return collection(db, COLLECTIONS.PRAYER_REQUESTS, prayerId, "comments");
}

export async function getPrayerComments(prayerId: string): Promise<PrayerCommentModel[]> {
  const snapshot = await getDocs(query(prayerCommentsRef(prayerId), orderBy("createdAt", "asc")));
  return snapshot.docs.map((entry) => ({ id: entry.id, prayerId, ...(entry.data() as Omit<PrayerCommentModel, "id" | "prayerId">) }));
}

export async function addPrayerComment(
  prayerId: string,
  data: PrayerCommentInput,
  author: PrayerAuthorContext,
): Promise<string> {
  const commentRef = prayerCommentsRef(prayerId);
  const parentRef = doc(db, COLLECTIONS.PRAYER_REQUESTS, prayerId);
  return runTransaction(db, async (transaction) => {
    const parent = await transaction.get(parentRef);
    if (!parent.exists()) {
      throw new Error("기도 요청을 찾을 수 없습니다.");
    }

    const newDoc = doc(commentRef);
    transaction.set(newDoc, {
      prayerId,
      content: data.content,
      isAnonymous: data.isAnonymous,
      authorName: data.isAnonymous ? null : author.displayName,
      createdBy: author.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    transaction.update(parentRef, {
      commentCount: ((parent.data().commentCount as number) ?? 0) + 1,
      updatedAt: serverTimestamp(),
      updatedBy: author.uid,
    });
    return newDoc.id;
  });
}

export async function deletePrayerComment(
  prayerId: string,
  commentId: string,
  userId: string,
): Promise<void> {
  const commentRef = doc(db, COLLECTIONS.PRAYER_REQUESTS, prayerId, "comments", commentId);
  const parentRef = doc(db, COLLECTIONS.PRAYER_REQUESTS, prayerId);
  await runTransaction(db, async (transaction) => {
    const parent = await transaction.get(parentRef);
    if (!parent.exists()) {
      throw new Error("기도 요청을 찾을 수 없습니다.");
    }
    transaction.delete(commentRef);
    transaction.update(parentRef, {
      commentCount: Math.max(0, ((parent.data().commentCount as number) ?? 1) - 1),
      updatedAt: serverTimestamp(),
      updatedBy: userId,
    });
  });
}

export async function togglePrayerLike(prayerId: string, userId: string): Promise<boolean> {
  const likeRef = doc(db, COLLECTIONS.PRAYER_REQUESTS, prayerId, "likes", userId);
  const parentRef = doc(db, COLLECTIONS.PRAYER_REQUESTS, prayerId);

  return runTransaction(db, async (transaction) => {
    const [parent, like] = await Promise.all([transaction.get(parentRef), transaction.get(likeRef)]);
    if (!parent.exists()) {
      throw new Error("기도 요청을 찾을 수 없습니다.");
    }

    const currentCount = (parent.data().prayerCount as number) ?? 0;
    const liked = like.exists();

    if (liked) {
      transaction.delete(likeRef);
      transaction.update(parentRef, {
        prayerCount: Math.max(0, currentCount - 1),
        updatedAt: serverTimestamp(),
        updatedBy: userId,
      });
      return false;
    }

    transaction.set(likeRef, {
      prayerId,
      userId,
      createdAt: serverTimestamp(),
    });
    transaction.update(parentRef, {
      prayerCount: currentCount + 1,
      updatedAt: serverTimestamp(),
      updatedBy: userId,
    });
    return true;
  });
}

export async function getPrayerLikeMap(prayerIds: string[], userId: string) {
  const pairs = await Promise.all(
    prayerIds.map(async (prayerId) => {
      const snapshot = await getDoc(doc(db, COLLECTIONS.PRAYER_REQUESTS, prayerId, "likes", userId));
      return [prayerId, snapshot.exists()] as const;
    }),
  );
  return Object.fromEntries(pairs);
}

export async function setPrayerAnswered(
  prayerId: string,
  answered: boolean,
  userId: string,
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.PRAYER_REQUESTS, prayerId), {
    isAnswered: answered,
    answeredAt: answered ? new Date().toISOString() : null,
    updatedAt: serverTimestamp(),
    updatedBy: userId,
  });
}
