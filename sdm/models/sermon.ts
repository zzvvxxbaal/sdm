import { z } from "zod";
import type { FirestoreBase } from "@/types/firestore";

export const sermonSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  scripture: z.string().min(1),
  preacher: z.string().min(1),
  date: z.string().min(1),
  series: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  audioUrl: z.string().url().nullable().optional(),
  videoUrl: z.string().url().nullable().optional(),
  transcript: z.string().nullable().optional(),
  slidesUrl: z.string().url().nullable().optional(),
  notes: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  viewCount: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  createdAt: z.any(),
  updatedAt: z.any(),
  createdBy: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export type Sermon = z.infer<typeof sermonSchema>;

export interface SermonModel extends FirestoreBase {
  title: string;
  scripture: string;
  preacher: string;
  date: string;
  series: string | null;
  description: string | null;
  audioUrl: string | null;
  videoUrl: string | null;
  transcript: string | null;
  slidesUrl: string | null;
  notes: string | null;
  tags: string[];
  viewCount: number;
  isActive: boolean;
}

export const sermonConverter = {
  toFirestore(sermon: Omit<SermonModel, "id">): Record<string, unknown> {
    return {
      title: sermon.title,
      scripture: sermon.scripture,
      preacher: sermon.preacher,
      date: sermon.date,
      series: sermon.series,
      description: sermon.description,
      audioUrl: sermon.audioUrl,
      videoUrl: sermon.videoUrl,
      transcript: sermon.transcript,
      slidesUrl: sermon.slidesUrl,
      notes: sermon.notes,
      tags: sermon.tags,
      viewCount: sermon.viewCount,
      isActive: sermon.isActive,
      createdAt: sermon.createdAt,
      updatedAt: sermon.updatedAt,
      createdBy: sermon.createdBy,
      updatedBy: sermon.updatedBy,
    };
  },
  fromFirestore(data: Record<string, unknown>): Omit<SermonModel, "id"> {
    return {
      title: data.title as string,
      scripture: data.scripture as string,
      preacher: data.preacher as string,
      date: data.date as string,
      series: (data.series as string) ?? null,
      description: (data.description as string) ?? null,
      audioUrl: (data.audioUrl as string) ?? null,
      videoUrl: (data.videoUrl as string) ?? null,
      transcript: (data.transcript as string) ?? null,
      slidesUrl: (data.slidesUrl as string) ?? null,
      notes: (data.notes as string) ?? null,
      tags: (data.tags as string[]) ?? [],
      viewCount: (data.viewCount as number) ?? 0,
      isActive: (data.isActive as boolean) ?? true,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: (data.createdBy as string) ?? null,
      updatedBy: (data.updatedBy as string) ?? null,
    };
  },
};
