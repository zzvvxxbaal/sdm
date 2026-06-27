import { z } from "zod";

export const cellLabelSchema = z.object({
  singular: z.string().min(1).max(20).default("순"),
  plural: z.string().min(1).max(20).default("순들"),
});

export const teamLabelSchema = z.object({
  singular: z.string().min(1).max(20).default("팀"),
  plural: z.string().min(1).max(20).default("팀들"),
});

export const organizationSettingsSchema = z.object({
  id: z.string().min(1),
  cellLabel: cellLabelSchema,
  teamLabel: teamLabelSchema,
  maxTeams: z.number().int().min(0).default(0),
  maxCellsPerTeam: z.number().int().min(0).default(0),
  maxMembersPerCell: z.number().int().min(0).default(0),
  allowCellTransfer: z.boolean().default(true),
  allowMemberSelfTransfer: z.boolean().default(false),
  requireLeaderApproval: z.boolean().default(true),
  updatedAt: z.any(),
  updatedBy: z.string().nullable().optional(),
});

export type OrganizationSettings = z.infer<typeof organizationSettingsSchema>;

export interface OrganizationSettingsModel {
  id: string;
  cellLabel: {
    singular: string;
    plural: string;
  };
  teamLabel: {
    singular: string;
    plural: string;
  };
  maxTeams: number;
  maxCellsPerTeam: number;
  maxMembersPerCell: number;
  allowCellTransfer: boolean;
  allowMemberSelfTransfer: boolean;
  requireLeaderApproval: boolean;
  updatedAt: unknown;
  updatedBy: string | null;
}

export const organizationSettingsConverter = {
  toFirestore(settings: Omit<OrganizationSettingsModel, "id">): Record<string, unknown> {
    return {
      cellLabel: settings.cellLabel,
      teamLabel: settings.teamLabel,
      maxTeams: settings.maxTeams,
      maxCellsPerTeam: settings.maxCellsPerTeam,
      maxMembersPerCell: settings.maxMembersPerCell,
      allowCellTransfer: settings.allowCellTransfer,
      allowMemberSelfTransfer: settings.allowMemberSelfTransfer,
      requireLeaderApproval: settings.requireLeaderApproval,
      updatedAt: settings.updatedAt,
      updatedBy: settings.updatedBy,
    };
  },
  fromFirestore(data: Record<string, unknown>): Omit<OrganizationSettingsModel, "id"> {
    return {
      cellLabel: (data.cellLabel as { singular: string; plural: string }) ?? { singular: "순", plural: "순들" },
      teamLabel: (data.teamLabel as { singular: string; plural: string }) ?? { singular: "팀", plural: "팀들" },
      maxTeams: (data.maxTeams as number) ?? 0,
      maxCellsPerTeam: (data.maxCellsPerTeam as number) ?? 0,
      maxMembersPerCell: (data.maxMembersPerCell as number) ?? 0,
      allowCellTransfer: (data.allowCellTransfer as boolean) ?? true,
      allowMemberSelfTransfer: (data.allowMemberSelfTransfer as boolean) ?? false,
      requireLeaderApproval: (data.requireLeaderApproval as boolean) ?? true,
      updatedAt: data.updatedAt,
      updatedBy: (data.updatedBy as string) ?? null,
    };
  },
};
