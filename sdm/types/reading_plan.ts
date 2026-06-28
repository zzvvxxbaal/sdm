import type { FirestoreTimestamp } from "./firestore";

export interface ReadingPlan {
  id: string;
  name: string;
  description: string | null;
  totalDays: number;
  assignments: ReadingPlanAssignment[];
  isActive: boolean;
  isDefault: boolean;
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}

export interface ReadingPlanInput {
  name: string;
  description: string | null;
  totalDays: number;
  assignments: ReadingPlanAssignment[];
  isActive: boolean;
  isDefault: boolean;
}

export interface ReadingPlanAssignment {
  day: number;
  bookId: string;
  chapterNumber: number;
  description: string;
}

export interface ReadingProgress {
  id: string;
  userId: string;
  planId: string;
  progressId: string;
  completedAssignments: number[];
  createdAt?: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
}
