import { z } from "zod";
import type { FirestoreBase } from "@/types/firestore";
import type { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export const cellSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  teamId: z.string().min(1),
  displayOrder: z.number().int().min(0).default(0),
  leaderId: z.string().nullable().optional(),
  leaderName: z.string().nullable().optional(),
  assistantLeaderId: z.string().nullable().optional(),
  assistantLeaderName: z.string().nullable().optional(),
  members: z.array(z.string()).default([]),
  memberCount: z.number().int().min(0).default(0),
  description: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.any(),
  updatedAt: z.any(),
  createdBy: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export type Cell = z.infer<typeof cellSchema>;

export interface CellModel extends FirestoreBase {
  name: string;
  teamId: string;
  displayOrder: number;
  leaderId: string | null;
  leaderName: string | null;
  assistantLeaderId: string | null;
  assistantLeaderName: string | null;
  members: string[];
  memberCount: number;
  description: string | null;
  isActive: boolean;
}

export const cellConverter = {
  toFirestore(cell: Omit<CellModel, "id">): Record<string, unknown> {
    return {
      name: cell.name,
      teamId: cell.teamId,
      displayOrder: cell.displayOrder,
      leaderId: cell.leaderId,
      leaderName: cell.leaderName,
      assistantLeaderId: cell.assistantLeaderId,
      assistantLeaderName: cell.assistantLeaderName,
      members: cell.members,
      memberCount: cell.memberCount,
      description: cell.description,
      isActive: cell.isActive,
      createdAt: cell.createdAt,
      updatedAt: cell.updatedAt,
      createdBy: cell.createdBy,
      updatedBy: cell.updatedBy,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions,
  ): Omit<CellModel, "id"> {
    const data = snapshot.data(options);
    return {
      name: data.name as string,
      teamId: data.teamId as string,
      displayOrder: (data.displayOrder as number) ?? 0,
      leaderId: (data.leaderId as string) ?? null,
      leaderName: (data.leaderName as string) ?? null,
      assistantLeaderId: (data.assistantLeaderId as string) ?? null,
      assistantLeaderName: (data.assistantLeaderName as string) ?? null,
      members: (data.members as string[]) ?? [],
      memberCount: (data.memberCount as number) ?? 0,
      description: (data.description as string) ?? null,
      isActive: (data.isActive as boolean) ?? true,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: (data.createdBy as string) ?? null,
      updatedBy: (data.updatedBy as string) ?? null,
    };
  },
};
