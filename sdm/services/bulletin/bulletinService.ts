import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/config";
import { COLLECTIONS } from "@/constants/collections";
import { bulletinConverter, type BulletinModel } from "@/models/bulletin";

const bulletinRef = collection(db, COLLECTIONS.BULLETINS).withConverter(bulletinConverter);

export interface BulletinInput {
  title: string;
  date: string;
  fileURL: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  fileType?: string | null;
  resourceKind?: BulletinModel["resourceKind"];
  preacher: string | null;
  scripture: string | null;
  sermonTitle: string | null;
  content?: string | null;
}

export async function getAllBulletins(): Promise<BulletinModel[]> {
  const snapshot = await getDocs(
    query(bulletinRef, where("isActive", "==", true), orderBy("date", "desc")),
  );
  return snapshot.docs.map((entry) => ({ ...entry.data(), id: entry.id }) as BulletinModel);
}

export async function getBulletinById(id: string): Promise<BulletinModel | null> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.BULLETINS, id).withConverter(bulletinConverter));
  if (!snapshot.exists()) return null;
  return { ...snapshot.data(), id: snapshot.id } as BulletinModel;
}

export async function createBulletin(data: BulletinInput, authorId: string): Promise<string> {
  const now = serverTimestamp();
  const docRef = await addDoc(collection(db, COLLECTIONS.BULLETINS), {
    ...data,
    fileName: data.fileName ?? null,
    fileSize: data.fileSize ?? null,
    fileType: data.fileType ?? null,
    resourceKind: data.resourceKind ?? "url",
    content: data.content ?? null,
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
