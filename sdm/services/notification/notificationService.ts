import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/config";
import { COLLECTIONS } from "@/constants/collections";
import { notificationConverter, type NotificationModel } from "@/models/notification";

const notificationRef = collection(db, COLLECTIONS.NOTIFICATIONS).withConverter(notificationConverter);

export interface NotificationInput {
  userId: string;
  type: NotificationModel["type"];
  audienceType: NotificationModel["audienceType"];
  title: string;
  body: string;
  link?: string | null;
  relatedCollection?: string | null;
  relatedId?: string | null;
  metadata?: NotificationModel["metadata"];
  scheduledFor?: string | null;
  status?: NotificationModel["status"];
}

export async function createNotification(input: NotificationInput, authorId: string) {
  const now = serverTimestamp();
  const docRef = await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
    userId: input.userId,
    type: input.type,
    audienceType: input.audienceType,
    title: input.title,
    body: input.body,
    link: input.link ?? null,
    relatedCollection: input.relatedCollection ?? null,
    relatedId: input.relatedId ?? null,
    status: input.status ?? (input.scheduledFor ? "scheduled" : "sent"),
    metadata: input.metadata ?? {},
    scheduledFor: input.scheduledFor ?? null,
    sentAt: input.scheduledFor ? null : new Date().toISOString(),
    isRead: false,
    readAt: null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    createdBy: authorId,
    updatedBy: authorId,
  });
  return docRef.id;
}

export async function createBulkNotifications(
  userIds: string[],
  input: Omit<NotificationInput, "userId">,
  authorId: string,
) {
  return Promise.all(userIds.map((userId) => createNotification({ ...input, userId }, authorId)));
}

export async function getUserNotifications(userId: string): Promise<NotificationModel[]> {
  const snapshot = await getDocs(
    query(
      notificationRef,
      where("userId", "==", userId),
      where("isActive", "==", true),
      orderBy("createdAt", "desc"),
    ),
  );
  return snapshot.docs.map((entry) => ({ ...entry.data(), id: entry.id }) as NotificationModel);
}

export async function markNotificationAsRead(id: string, userId: string) {
  await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id), {
    isRead: true,
    readAt: new Date().toISOString(),
    updatedAt: serverTimestamp(),
    updatedBy: userId,
  });
}
