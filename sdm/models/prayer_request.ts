import { z } from "zod";
import type { FirestoreBase } from "@/types/firestore";
import type { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { PRAYER_CATEGORIES, PRAYER_VISIBILITIES, type PrayerCategory, type PrayerVisibility } from "@/types/prayer";

export const prayerRequestSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  category: z.enum(PRAYER_CATEGORIES).default("personal"),
  isAnonymous: z.boolean().default(false),
  visibility: z.enum(PRAYER_VISIBILITIES).default("church"),
  teamId: z.string().nullable().optional(),
  cellId: z.string().nullable().optional(),
  authorName: z.string().nullable().optional(),
  prayerCount: z.number().int().min(0).default(0),
  commentCount: z.number().int().min(0).default(0),
  isPinned: z.boolean().default(false),
  isAnswered: z.boolean().default(false),
  answeredAt: z.string().nullable().optional(),
  searchTokens: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  createdAt: z.any(),
  updatedAt: z.any(),
  createdBy: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export type PrayerRequest = z.infer<typeof prayerRequestSchema>;

export interface PrayerRequestModel extends FirestoreBase {
  title: string;
  content: string;
  category: PrayerCategory;
  isAnonymous: boolean;
  visibility: PrayerVisibility;
  teamId: string | null;
  cellId: string | null;
  authorName: string | null;
  isAnswered: boolean;
  answeredAt: string | null;
  prayerCount: number;
  commentCount: number;
  isPinned: boolean;
  searchTokens: string[];
  isActive: boolean;
}

export const prayerRequestConverter = {
  toFirestore(prayer: Omit<PrayerRequestModel, "id">): Record<string, unknown> {
    return {
      title: prayer.title,
      content: prayer.content,
      category: prayer.category,
      isAnonymous: prayer.isAnonymous,
      visibility: prayer.visibility,
      teamId: prayer.teamId,
      cellId: prayer.cellId,
      authorName: prayer.authorName,
      isAnswered: prayer.isAnswered,
      answeredAt: prayer.answeredAt,
      prayerCount: prayer.prayerCount,
      commentCount: prayer.commentCount,
      isPinned: prayer.isPinned,
      searchTokens: prayer.searchTokens,
      isActive: prayer.isActive,
      createdAt: prayer.createdAt,
      updatedAt: prayer.updatedAt,
      createdBy: prayer.createdBy,
      updatedBy: prayer.updatedBy,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions,
  ): Omit<PrayerRequestModel, "id"> {
    const data = snapshot.data(options);
    return {
      title: data.title as string,
      content: data.content as string,
      category: (data.category as PrayerCategory) ?? "personal",
      isAnonymous: (data.isAnonymous as boolean) ?? false,
      visibility: (data.visibility as PrayerVisibility) ?? "church",
      teamId: (data.teamId as string) ?? null,
      cellId: (data.cellId as string) ?? null,
      authorName: (data.authorName as string) ?? null,
      isAnswered: (data.isAnswered as boolean) ?? false,
      answeredAt: (data.answeredAt as string) ?? null,
      prayerCount: (data.prayerCount as number) ?? 0,
      commentCount: (data.commentCount as number) ?? 0,
      isPinned: (data.isPinned as boolean) ?? false,
      searchTokens: (data.searchTokens as string[]) ?? [],
      isActive: (data.isActive as boolean) ?? true,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: (data.createdBy as string) ?? null,
      updatedBy: (data.updatedBy as string) ?? null,
    };
  },
};
