import { z } from "zod";
import type { FirestoreBase } from "@/types/firestore";

export const bulletinSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  content: z.string().nullable().optional(),
  fileURL: z.string().url().nullable().optional(),
  fileName: z.string().nullable().optional(),
  fileSize: z.number().int().min(0).nullable().optional(),
  fileType: z.string().nullable().optional(),
  date: z.string().min(1),
  sermonTitle: z.string().nullable().optional(),
  preacher: z.string().nullable().optional(),
  scripture: z.string().nullable().optional(),
  worshipTeam: z.array(z.string()).default([]),
  announcements: z.array(z.string()).default([]),
  viewCount: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  createdAt: z.any(),
  updatedAt: z.any(),
  createdBy: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export type Bulletin = z.infer<typeof bulletinSchema>;

export interface BulletinModel extends FirestoreBase {
  title: string;
  content: string | null;
  fileURL: string | null;
  fileName: string | null;
  fileSize: number | null;
  fileType: string | null;
  date: string;
  sermonTitle: string | null;
  preacher: string | null;
  scripture: string | null;
  worshipTeam: string[];
  announcements: string[];
  viewCount: number;
  isActive: boolean;
}

export const bulletinConverter = {
  toFirestore(bulletin: Omit<BulletinModel, "id">): Record<string, unknown> {
    return {
      title: bulletin.title,
      content: bulletin.content,
      fileURL: bulletin.fileURL,
      fileName: bulletin.fileName,
      fileSize: bulletin.fileSize,
      fileType: bulletin.fileType,
      date: bulletin.date,
      sermonTitle: bulletin.sermonTitle,
      preacher: bulletin.preacher,
      scripture: bulletin.scripture,
      worshipTeam: bulletin.worshipTeam,
      announcements: bulletin.announcements,
      viewCount: bulletin.viewCount,
      isActive: bulletin.isActive,
      createdAt: bulletin.createdAt,
      updatedAt: bulletin.updatedAt,
      createdBy: bulletin.createdBy,
      updatedBy: bulletin.updatedBy,
    };
  },
  fromFirestore(data: Record<string, unknown>): Omit<BulletinModel, "id"> {
    return {
      title: data.title as string,
      content: (data.content as string) ?? null,
      fileURL: (data.fileURL as string) ?? null,
      fileName: (data.fileName as string) ?? null,
      fileSize: (data.fileSize as number) ?? null,
      fileType: (data.fileType as string) ?? null,
      date: data.date as string,
      sermonTitle: (data.sermonTitle as string) ?? null,
      preacher: (data.preacher as string) ?? null,
      scripture: (data.scripture as string) ?? null,
      worshipTeam: (data.worshipTeam as string[]) ?? [],
      announcements: (data.announcements as string[]) ?? [],
      viewCount: (data.viewCount as number) ?? 0,
      isActive: (data.isActive as boolean) ?? true,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: (data.createdBy as string) ?? null,
      updatedBy: (data.updatedBy as string) ?? null,
    };
  },
};
