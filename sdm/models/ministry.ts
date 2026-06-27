import { z } from "zod";
import type { FirestoreBase } from "@/types/firestore";
import type { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export const ministrySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().nullable().optional(),
  leaderId: z.string().nullable().optional(),
  leaderName: z.string().nullable().optional(),
  members: z.array(z.string()).default([]),
  category: z.enum(["worship", "education", "evangelism", "service", "fellowship", "mission", "media", "other"]).default("other"),
  meetingDay: z.string().nullable().optional(),
  meetingTime: z.string().nullable().optional(),
  meetingLocation: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.any(),
  updatedAt: z.any(),
  createdBy: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export type Ministry = z.infer<typeof ministrySchema>;

export interface MinistryModel extends FirestoreBase {
  name: string;
  description: string | null;
  leaderId: string | null;
  leaderName: string | null;
  members: string[];
  category: "worship" | "education" | "evangelism" | "service" | "fellowship" | "mission" | "media" | "other";
  meetingDay: string | null;
  meetingTime: string | null;
  meetingLocation: string | null;
  isActive: boolean;
}

export const ministryConverter = {
  toFirestore(ministry: Omit<MinistryModel, "id">): Record<string, unknown> {
    return {
      name: ministry.name,
      description: ministry.description,
      leaderId: ministry.leaderId,
      leaderName: ministry.leaderName,
      members: ministry.members,
      category: ministry.category,
      meetingDay: ministry.meetingDay,
      meetingTime: ministry.meetingTime,
      meetingLocation: ministry.meetingLocation,
      isActive: ministry.isActive,
      createdAt: ministry.createdAt,
      updatedAt: ministry.updatedAt,
      createdBy: ministry.createdBy,
      updatedBy: ministry.updatedBy,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions,
  ): Omit<MinistryModel, "id"> {
    const data = snapshot.data(options);
    return {
      name: data.name as string,
      description: (data.description as string) ?? null,
      leaderId: (data.leaderId as string) ?? null,
      leaderName: (data.leaderName as string) ?? null,
      members: (data.members as string[]) ?? [],
      category: (data.category as MinistryModel["category"]) ?? "other",
      meetingDay: (data.meetingDay as string) ?? null,
      meetingTime: (data.meetingTime as string) ?? null,
      meetingLocation: (data.meetingLocation as string) ?? null,
      isActive: (data.isActive as boolean) ?? true,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: (data.createdBy as string) ?? null,
      updatedBy: (data.updatedBy as string) ?? null,
    };
  },
};
