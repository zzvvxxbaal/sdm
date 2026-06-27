/**
 * Reading Plan Service
 * Manages Bible reading plans and progress tracking.
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
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import type {
  ReadingPlan,
  ReadingPlanInput,
  ReadingPlanAssignment,
  ReadingProgress,
} from "@/types/reading_plan";

const PLANS_COLLECTION = "reading_plans";
const PROGRESS_COLLECTION = "reading_progress";

// ─── Plan CRUD ───

export async function createReadingPlan(
  data: ReadingPlanInput
): Promise<string> {
  const docRef = await addDoc(collection(db, PLANS_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateReadingPlan(
  planId: string,
  data: Partial<ReadingPlanInput>
): Promise<void> {
  await updateDoc(doc(db, PLANS_COLLECTION, planId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteReadingPlan(planId: string): Promise<void> {
  await deleteDoc(doc(db, PLANS_COLLECTION, planId));
}

export async function getReadingPlan(planId: string): Promise<ReadingPlan | null> {
  const snap = await getDoc(doc(db, PLANS_COLLECTION, planId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as ReadingPlan;
}

export async function getAllReadingPlans(): Promise<ReadingPlan[]> {
  const q = query(
    collection(db, PLANS_COLLECTION),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ReadingPlan);
}

export async function getActiveReadingPlans(): Promise<ReadingPlan[]> {
  const q = query(
    collection(db, PLANS_COLLECTION),
    where("isActive", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ReadingPlan);
}

// ─── Progress Tracking ───

export async function markAssignmentComplete(
  userId: string,
  planId: string,
  assignmentIndex: number
): Promise<void> {
  const progressId = `${userId}_${planId}`;
  const progressRef = doc(db, PROGRESS_COLLECTION, progressId);
  const snap = await getDoc(progressRef);

  if (snap.exists()) {
    const data = snap.data() as ReadingProgress;
    const completed = new Set(data.completedAssignments || []);
    completed.add(assignmentIndex);
    await updateDoc(progressRef, {
      completedAssignments: Array.from(completed),
      updatedAt: serverTimestamp(),
    });
  } else {
    await addDoc(collection(db, PROGRESS_COLLECTION), {
      userId,
      planId,
      progressId,
      completedAssignments: [assignmentIndex],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function getUserProgress(
  userId: string,
  planId: string
): Promise<ReadingProgress | null> {
  const progressId = `${userId}_${planId}`;
  const snap = await getDoc(doc(db, PROGRESS_COLLECTION, progressId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as ReadingProgress;
}

export async function getAllUserProgress(userId: string): Promise<ReadingProgress[]> {
  const q = query(
    collection(db, PROGRESS_COLLECTION),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ReadingProgress);
}

// ─── Built-in Plans ───

export function getOneYearPlan(): ReadingPlanInput {
  const assignments: ReadingPlanAssignment[] = [];
  const books = [
    { id: "gen", chapters: 50 },
    { id: "exo", chapters: 40 },
    { id: "lev", chapters: 27 },
    { id: "num", chapters: 36 },
    { id: "deu", chapters: 34 },
    { id: "jos", chapters: 24 },
    { id: "jdg", chapters: 21 },
    { id: "rut", chapters: 4 },
    { id: "1sa", chapters: 31 },
    { id: "2sa", chapters: 24 },
    { id: "1ki", chapters: 22 },
    { id: "2ki", chapters: 25 },
    { id: "1ch", chapters: 29 },
    { id: "2ch", chapters: 36 },
    { id: "ezr", chapters: 10 },
    { id: "neh", chapters: 13 },
    { id: "est", chapters: 10 },
    { id: "job", chapters: 42 },
    { id: "psa", chapters: 150 },
    { id: "pro", chapters: 31 },
    { id: "ecc", chapters: 12 },
    { id: "sos", chapters: 8 },
    { id: "isa", chapters: 66 },
    { id: "jer", chapters: 52 },
    { id: "lam", chapters: 5 },
    { id: "eze", chapters: 48 },
    { id: "dan", chapters: 12 },
    { id: "hos", chapters: 14 },
    { id: "joe", chapters: 3 },
    { id: "amo", chapters: 9 },
    { id: "oba", chapters: 1 },
    { id: "jon", chapters: 4 },
    { id: "mic", chapters: 7 },
    { id: "nah", chapters: 3 },
    { id: "hab", chapters: 3 },
    { id: "zep", chapters: 3 },
    { id: "hag", chapters: 2 },
    { id: "zec", chapters: 14 },
    { id: "mal", chapters: 4 },
    { id: "mat", chapters: 28 },
    { id: "mar", chapters: 16 },
    { id: "luk", chapters: 24 },
    { id: "joh", chapters: 21 },
    { id: "act", chapters: 28 },
    { id: "rom", chapters: 16 },
    { id: "1co", chapters: 16 },
    { id: "2co", chapters: 13 },
    { id: "gal", chapters: 6 },
    { id: "eph", chapters: 6 },
    { id: "phi", chapters: 4 },
    { id: "col", chapters: 4 },
    { id: "1th", chapters: 5 },
    { id: "2th", chapters: 3 },
    { id: "1ti", chapters: 6 },
    { id: "2ti", chapters: 4 },
    { id: "tit", chapters: 3 },
    { id: "phm", chapters: 1 },
    { id: "heb", chapters: 13 },
    { id: "jas", chapters: 5 },
    { id: "1pe", chapters: 5 },
    { id: "2pe", chapters: 3 },
    { id: "1jo", chapters: 5 },
    { id: "2jo", chapters: 1 },
    { id: "3jo", chapters: 1 },
    { id: "jud", chapters: 1 },
    { id: "rev", chapters: 22 },
  ];

  let day = 1;
  for (const book of books) {
    for (let ch = 1; ch <= book.chapters; ch++) {
      assignments.push({
        day,
        bookId: book.id,
        chapterNumber: ch,
        description: `${book.id} ${ch}장`,
      });
      day++;
    }
  }

  return {
    name: "1년 통독",
    description: "66권 성경을 1년 안에 하나씩 읽는 계획",
    totalDays: assignments.length,
    assignments,
    isActive: true,
    isDefault: true,
  };
}

export function getNewTestamentPlan(): ReadingPlanInput {
  const assignments: ReadingPlanAssignment[] = [];
  const ntBooks = [
    { id: "mat", chapters: 28 },
    { id: "mar", chapters: 16 },
    { id: "luk", chapters: 24 },
    { id: "joh", chapters: 21 },
    { id: "act", chapters: 28 },
    { id: "rom", chapters: 16 },
    { id: "1co", chapters: 16 },
    { id: "2co", chapters: 13 },
    { id: "gal", chapters: 6 },
    { id: "eph", chapters: 6 },
    { id: "phi", chapters: 4 },
    { id: "col", chapters: 4 },
    { id: "1th", chapters: 5 },
    { id: "2th", chapters: 3 },
    { id: "1ti", chapters: 6 },
    { id: "2ti", chapters: 4 },
    { id: "tit", chapters: 3 },
    { id: "phm", chapters: 1 },
    { id: "heb", chapters: 13 },
    { id: "jas", chapters: 5 },
    { id: "1pe", chapters: 5 },
    { id: "2pe", chapters: 3 },
    { id: "1jo", chapters: 5 },
    { id: "2jo", chapters: 1 },
    { id: "3jo", chapters: 1 },
    { id: "jud", chapters: 1 },
    { id: "rev", chapters: 22 },
  ];

  let day = 1;
  for (const book of ntBooks) {
    for (let ch = 1; ch <= book.chapters; ch++) {
      assignments.push({
        day,
        bookId: book.id,
        chapterNumber: ch,
        description: `${book.id} ${ch}장`,
      });
      day++;
    }
  }

  return {
    name: "신약 통독",
    description: "신약 27권을 차례대로 읽는 계획",
    totalDays: assignments.length,
    assignments,
    isActive: true,
    isDefault: true,
  };
}
