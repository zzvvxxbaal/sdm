import { z } from "zod";
import type { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export const todaysVerseSchema = z.object({
  reference: z.string().min(1),
  text: z.string().min(1),
});

export const todaysQtSchema = z.object({
  reference: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable(),
});

export const dailyContentSchema = z.object({
  id: z.string().min(1),
  todaysVerse: todaysVerseSchema.nullable(),
  todaysQt: todaysQtSchema.nullable(),
  updatedAt: z.any(),
  updatedBy: z.string().nullable().optional(),
});

export type DailyContent = z.infer<typeof dailyContentSchema>;

export interface TodaysVerse {
  reference: string;
  text: string;
}

export interface TodaysQtPassage {
  reference: string;
  title: string;
  description: string | null;
}

export interface DailyContentModel {
  id: string;
  todaysVerse: TodaysVerse | null;
  todaysQt: TodaysQtPassage | null;
  updatedAt: unknown;
  updatedBy: string | null;
}

export const dailyContentConverter = {
  toFirestore(content: Omit<DailyContentModel, "id">): Record<string, unknown> {
    return {
      todaysVerse: content.todaysVerse,
      todaysQt: content.todaysQt,
      updatedAt: content.updatedAt,
      updatedBy: content.updatedBy,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions,
  ): Omit<DailyContentModel, "id"> {
    const data = snapshot.data(options);
    return {
      todaysVerse: (data.todaysVerse as TodaysVerse) ?? null,
      todaysQt: (data.todaysQt as TodaysQtPassage) ?? null,
      updatedAt: data.updatedAt,
      updatedBy: (data.updatedBy as string) ?? null,
    };
  },
};
