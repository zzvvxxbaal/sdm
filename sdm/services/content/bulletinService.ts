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
import { bulletinConverter, type BulletinModel } from "@/models/bulletin";

const ref = collection(db, COLLECTIONS.BULLETINS).withConverter(bulletinConverter);

export async function getAllBulletins(): Promise<BulletinModel[]> {
  const q = query(ref, orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as BulletinModel);
}

export interface BulletinInput {
  title: string;
  date: string;
  fileURL: string | null;
  preacher: string | null;
  scripture: string | null;
  sermonTitle: string | null;
}

export async function createBulletin(data: BulletinInput, authorId: string): Promise<string> {
  const now = serverTimestamp();
  const docRef = await addDoc(collection(db, COLLECTIONS.BULLETINS), {
    ...data,
    content: null,
    fileName: null,
    fileSize: null,
    fileType: null,
    worshipTeam: [],
    announcements: [],
    viewCount: 0,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    createdBy: authorId,
    updatedBy: authorId,
  });
  return docRef.id;
}

export async function updateBulletin(
  id: string,
  data: Partial<BulletinInput>,
  authorId: string,
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.BULLETINS, id), {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: authorId,
  });
}

export async function deleteBulletin(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.BULLETINS, id));
}
