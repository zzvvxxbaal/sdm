export interface ReadingPlan {
  id: string;
  name: string;
  description: string | null;
  totalDays: number;
  assignments: ReadingPlanAssignment[];
  isActive: boolean;
  isDefault: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
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
  createdAt?: unknown;
  updatedAt?: unknown;
}
