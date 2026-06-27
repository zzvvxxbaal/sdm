import { z } from "zod";
import type { FirestoreBase } from "@/types/firestore";
import type { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export const cellGroupSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  description: z.string().nullable().optional(),
  leaderId: z.string().min(1),
  leaderName: z.string().min(1),
  members: z.array(z.string()).default([]),
  memberCount: z.number().int().min(0).default(0),
  generation: z.string().nullable().optional(),
  meetingDay: z.string().nullable().optional(),
  meetingTime: z.string().nullable().optional(),
  meetingLocation: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.any(),
  updatedAt: z.any(),
  createdBy: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export type CellGroup = z.infer<typeof cellGroupSchema>;

export interface CellGroupModel extends FirestoreBase {
  name: string;
  description: string | null;
  leaderId: string;
  leaderName: string;
  members: string[];
  memberCount: number;
  generation: string | null;
  meetingDay: string | null;
  meetingTime: string | null;
  meetingLocation: string | null;
  isActive: boolean;
}

export const cellGroupConverter = {
  toFirestore(cellGroup: Omit<CellGroupModel, "id">): Record<string, unknown> {
    return {
      name: cellGroup.name,
      description: cellGroup.description,
      leaderId: cellGroup.leaderId,
      leaderName: cellGroup.leaderName,
      members: cellGroup.members,
      memberCount: cellGroup.memberCount,
      generation: cellGroup.generation,
      meetingDay: cellGroup.meetingDay,
      meetingTime: cellGroup.meetingTime,
      meetingLocation: cellGroup.meetingLocation,
      isActive: cellGroup.isActive,
      createdAt: cellGroup.createdAt,
      updatedAt: cellGroup.updatedAt,
      createdBy: cellGroup.createdBy,
      updatedBy: cellGroup.updatedBy,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions,
  ): Omit<CellGroupModel, "id"> {
    const data = snapshot.data(options);
    return {
      name: data.name as string,
      description: (data.description as string) ?? null,
      leaderId: data.leaderId as string,
      leaderName: data.leaderName as string,
      members: (data.members as string[]) ?? [],
      memberCount: (data.memberCount as number) ?? 0,
      generation: (data.generation as string) ?? null,
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
