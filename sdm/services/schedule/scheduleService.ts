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
import { eventConverter, type EventModel } from "@/models/event";
import { endOfMonthDate, endOfWeekMonday, startOfMonthDate, startOfWeekMonday } from "@/lib/date";

const eventRef = collection(db, COLLECTIONS.EVENTS).withConverter(eventConverter);

export interface ScheduleEventInput {
  title: string;
  startDate: string;
  endDate: string | null;
  location: string | null;
  category: EventModel["category"];
  description: string | null;
  isAllDay?: boolean;
}

export async function getAllScheduleEvents(): Promise<EventModel[]> {
  const snapshot = await getDocs(
    query(eventRef, where("isActive", "==", true), orderBy("startDate", "asc")),
  );
  return snapshot.docs.map((entry) => ({ ...entry.data(), id: entry.id }) as EventModel);
}

export async function getMonthlyScheduleEvents(anchorDate: Date): Promise<EventModel[]> {
  const start = startOfMonthDate(anchorDate).toISOString();
  const end = endOfMonthDate(anchorDate).toISOString();
  const snapshot = await getDocs(
    query(
      eventRef,
      where("isActive", "==", true),
      where("startDate", ">=", start),
      where("startDate", "<", end),
      orderBy("startDate", "asc"),
    ),
  );
  return snapshot.docs.map((entry) => ({ ...entry.data(), id: entry.id }) as EventModel);
}

export async function getWeeklyScheduleEvents(anchorDate: Date): Promise<EventModel[]> {
  const start = startOfWeekMonday(anchorDate).toISOString();
  const end = endOfWeekMonday(anchorDate).toISOString();
  const snapshot = await getDocs(
    query(
      eventRef,
      where("isActive", "==", true),
      where("startDate", ">=", start),
      where("startDate", "<", end),
      orderBy("startDate", "asc"),
    ),
  );
  return snapshot.docs.map((entry) => ({ ...entry.data(), id: entry.id }) as EventModel);
}

export async function getScheduleEventById(id: string): Promise<EventModel | null> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.EVENTS, id).withConverter(eventConverter));
  if (!snapshot.exists()) return null;
  return { ...snapshot.data(), id: snapshot.id } as EventModel;
}

export async function createScheduleEvent(data: ScheduleEventInput, authorId: string): Promise<string> {
  const now = serverTimestamp();
  const docRef = await addDoc(collection(db, COLLECTIONS.EVENTS), {
    ...data,
    isAllDay: data.isAllDay ?? false,
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

export async function updateScheduleEvent(
  id: string,
  data: Partial<ScheduleEventInput>,
  authorId: string,
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.EVENTS, id), {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: authorId,
  });
}

export async function deleteScheduleEvent(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.EVENTS, id));
}
