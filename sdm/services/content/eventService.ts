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
import { eventConverter, type EventModel } from "@/models/event";

const ref = collection(db, COLLECTIONS.EVENTS).withConverter(eventConverter);

export async function getAllEvents(): Promise<EventModel[]> {
  const q = query(ref, orderBy("startDate", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as EventModel);
}

export interface EventInput {
  title: string;
  startDate: string;
  endDate: string | null;
  location: string | null;
  category: EventModel["category"];
  description: string | null;
}

export async function createEvent(data: EventInput, authorId: string): Promise<string> {
  const now = serverTimestamp();
  const docRef = await addDoc(collection(db, COLLECTIONS.EVENTS), {
    ...data,
    isAllDay: false,
    ministry: null,
    isRecurring: false,
    recurrenceRule: null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    createdBy: authorId,
    updatedBy: authorId,
  });
  return docRef.id;
}

export async function updateEvent(
  id: string,
  data: Partial<EventInput>,
  authorId: string,
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.EVENTS, id), {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: authorId,
  });
}

export async function deleteEvent(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.EVENTS, id));
}
