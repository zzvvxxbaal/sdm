import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { db } from "@/firebase/config";
import { COLLECTIONS } from "@/constants/collections";
import {
  dailyContentConverter,
  type DailyContentModel,
  type TodaysVerse,
  type TodaysQtPassage,
} from "@/models/daily_content";

const DOC_ID = "current";

const readRef = doc(db, COLLECTIONS.DAILY_CONTENT, DOC_ID).withConverter(dailyContentConverter);
const writeRef = doc(db, COLLECTIONS.DAILY_CONTENT, DOC_ID);

export async function getDailyContent(): Promise<DailyContentModel | null> {
  const snapshot = await getDoc(readRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as DailyContentModel;
}

export async function setTodaysVerse(verse: TodaysVerse, authorId: string): Promise<void> {
  await setDoc(
    writeRef,
    { todaysVerse: verse, updatedAt: serverTimestamp(), updatedBy: authorId },
    { merge: true },
  );
}

export async function setTodaysQt(passage: TodaysQtPassage, authorId: string): Promise<void> {
  await setDoc(
    writeRef,
    { todaysQt: passage, updatedAt: serverTimestamp(), updatedBy: authorId },
    { merge: true },
  );
}
