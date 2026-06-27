import { z } from "zod";
import type { FirestoreBase } from "@/types/firestore";

export const prayerRequestSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  category: z.enum(["personal", "family", "church", "mission", "healing", "other"]).default("personal"),
  isAnonymous: z.boolean().default(false),
  isAnswered: z.boolean().default(false),
  answeredAt: z.string().nullable().optional(),
  prayerCount: z.number().int().min(0).default(0),
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
  category: "personal" | "family" | "church" | "mission" | "healing" | "other";
  isAnonymous: boolean;
  isAnswered: boolean;
  answeredAt: string | null;
  prayerCount: number;
  isActive: boolean;
}

export const prayerRequestConverter = {
  toFirestore(prayer: Omit<PrayerRequestModel, "id">): Record<string, unknown> {
    return {
      title: prayer.title,
      content: prayer.content,
      category: prayer.category,
      isAnonymous: prayer.isAnonymous,
      isAnswered: prayer.isAnswered,
      answeredAt: prayer.answeredAt,
      prayerCount: prayer.prayerCount,
      isActive: prayer.isActive,
      createdAt: prayer.createdAt,
      updatedAt: prayer.updatedAt,
      createdBy: prayer.createdBy,
      updatedBy: prayer.updatedBy,
    };
  },
  fromFirestore(data: Record<string, unknown>): Omit<PrayerRequestModel, "id"> {
    return {
      title: data.title as string,
      content: data.content as string,
      category: (data.category as PrayerRequestModel["category"]) ?? "personal",
      isAnonymous: (data.isAnonymous as boolean) ?? false,
      isAnswered: (data.isAnswered as boolean) ?? false,
      answeredAt: (data.answeredAt as string) ?? null,
      prayerCount: (data.prayerCount as number) ?? 0,
      isActive: (data.isActive as boolean) ?? true,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: (data.createdBy as string) ?? null,
      updatedBy: (data.updatedBy as string) ?? null,
    };
  },
};
