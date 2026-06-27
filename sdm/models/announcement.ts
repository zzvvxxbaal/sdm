import { z } from "zod";
import type { FirestoreBase } from "@/types/firestore";
import type { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export const announcementSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  category: z.enum(["general", "urgent", "event", "ministry"]).default("general"),
  isPinned: z.boolean().default(false),
  isActive: z.boolean().default(true),
  viewCount: z.number().int().min(0).default(0),
  createdAt: z.any(),
  updatedAt: z.any(),
  createdBy: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export type Announcement = z.infer<typeof announcementSchema>;

export interface AnnouncementModel extends FirestoreBase {
  title: string;
  content: string;
  category: "general" | "urgent" | "event" | "ministry";
  isPinned: boolean;
  isActive: boolean;
  viewCount: number;
}

export const announcementConverter = {
  toFirestore(announcement: Omit<AnnouncementModel, "id">): Record<string, unknown> {
    return {
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      isPinned: announcement.isPinned,
      isActive: announcement.isActive,
      viewCount: announcement.viewCount,
      createdAt: announcement.createdAt,
      updatedAt: announcement.updatedAt,
      createdBy: announcement.createdBy,
      updatedBy: announcement.updatedBy,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions,
  ): Omit<AnnouncementModel, "id"> {
    const data = snapshot.data(options);
    return {
      title: data.title as string,
      content: data.content as string,
      category: (data.category as "general" | "urgent" | "event" | "ministry") ?? "general",
      isPinned: (data.isPinned as boolean) ?? false,
      isActive: (data.isActive as boolean) ?? true,
      viewCount: (data.viewCount as number) ?? 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: (data.createdBy as string) ?? null,
      updatedBy: (data.updatedBy as string) ?? null,
    };
  },
};
