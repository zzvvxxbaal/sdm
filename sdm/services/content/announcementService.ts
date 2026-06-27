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
import { announcementConverter, type AnnouncementModel } from "@/models/announcement";

const ref = collection(db, COLLECTIONS.ANNOUNCEMENTS).withConverter(announcementConverter);

export async function getAllAnnouncements(): Promise<AnnouncementModel[]> {
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as AnnouncementModel);
}

export interface AnnouncementInput {
  title: string;
  content: string;
  category: AnnouncementModel["category"];
  isPinned: boolean;
}

export async function createAnnouncement(
  data: AnnouncementInput,
  authorId: string,
): Promise<string> {
  const now = serverTimestamp();
  const docRef = await addDoc(collection(db, COLLECTIONS.ANNOUNCEMENTS), {
    ...data,
    isActive: true,
    viewCount: 0,
    createdAt: now,
    updatedAt: now,
    createdBy: authorId,
    updatedBy: authorId,
  });
  return docRef.id;
}

export async function updateAnnouncement(
  id: string,
  data: Partial<AnnouncementInput>,
  authorId: string,
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.ANNOUNCEMENTS, id), {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: authorId,
  });
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.ANNOUNCEMENTS, id));
}
