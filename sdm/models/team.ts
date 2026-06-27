import { z } from "zod";
import type { FirestoreBase } from "@/types/firestore";
import type { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export const teamSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  displayOrder: z.number().int().min(0).default(0),
  leaderId: z.string().nullable().optional(),
  leaderName: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  memberCount: z.number().int().min(0).default(0),
  createdAt: z.any(),
  updatedAt: z.any(),
  createdBy: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export type Team = z.infer<typeof teamSchema>;

export interface TeamModel extends FirestoreBase {
  name: string;
  displayOrder: number;
  leaderId: string | null;
  leaderName: string | null;
  description: string | null;
  isActive: boolean;
  memberCount: number;
}

export const teamConverter = {
  toFirestore(team: Omit<TeamModel, "id">): Record<string, unknown> {
    return {
      name: team.name,
      displayOrder: team.displayOrder,
      leaderId: team.leaderId,
      leaderName: team.leaderName,
      description: team.description,
      isActive: team.isActive,
      memberCount: team.memberCount,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      createdBy: team.createdBy,
      updatedBy: team.updatedBy,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions,
  ): Omit<TeamModel, "id"> {
    const data = snapshot.data(options);
    return {
      name: data.name as string,
      displayOrder: (data.displayOrder as number) ?? 0,
      leaderId: (data.leaderId as string) ?? null,
      leaderName: (data.leaderName as string) ?? null,
      description: (data.description as string) ?? null,
      isActive: (data.isActive as boolean) ?? true,
      memberCount: (data.memberCount as number) ?? 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: (data.createdBy as string) ?? null,
      updatedBy: (data.updatedBy as string) ?? null,
    };
  },
};
