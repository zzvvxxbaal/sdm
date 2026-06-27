import { z } from "zod";
import { UserRole } from "@/types/role";
import { ApprovalStatus, ChurchPosition, Gender } from "@/types/member";
import type { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

const statisticsSchema = z.object({
  attendanceCount: z.number().int().nonnegative().default(0),
  attendanceRate: z.number().min(0).max(100).default(0),
  qtCount: z.number().int().nonnegative().default(0),
  prayerCount: z.number().int().nonnegative().default(0),
});

export const userSchema = z.object({
  id: z.string().min(1),
  email: z.string().email().nullable(),
  displayName: z.string().min(1).max(50).nullable(),
  photoURL: z.string().url().nullable(),

  birthYear: z.number().int().nullable(),
  generation: z.string().nullable(),
  gender: z.nativeEnum(Gender).nullable(),
  phoneNumber: z.string().nullable(),
  introduction: z.string().max(500).nullable(),

  registeredAt: z.string().nullable(),
  teamId: z.string().nullable(),
  teamName: z.string().nullable(),
  cellId: z.string().nullable(),
  cellName: z.string().nullable(),
  ministry: z.string().nullable(),
  position: z.nativeEnum(ChurchPosition).default(ChurchPosition.NONE),
  isNewFamily: z.boolean().default(false),

  role: z.nativeEnum(UserRole).default(UserRole.USER),
  approvalStatus: z.nativeEnum(ApprovalStatus).default(ApprovalStatus.PENDING),
  isActive: z.boolean().default(true),
  emailVerified: z.boolean().default(false),
  profileCompleted: z.boolean().default(false),

  statistics: statisticsSchema,
  lastLoginAt: z.string().nullable(),

  approvedBy: z.string().nullable(),
  approvedAt: z.string().nullable(),
  rejectionReason: z.string().nullable(),

  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

export interface UserModel {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;

  birthYear: number | null;
  generation: string | null;
  gender: Gender | null;
  phoneNumber: string | null;
  introduction: string | null;

  registeredAt: string | null;
  teamId: string | null;
  teamName: string | null;
  cellId: string | null;
  cellName: string | null;
  ministry: string | null;
  position: ChurchPosition;
  isNewFamily: boolean;

  role: UserRole;
  approvalStatus: ApprovalStatus;
  isActive: boolean;
  emailVerified: boolean;
  profileCompleted: boolean;

  statistics: {
    attendanceCount: number;
    attendanceRate: number;
    qtCount: number;
    prayerCount: number;
  };
  lastLoginAt: string | null;

  approvedBy: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;

  createdAt: string;
  updatedAt: string;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === "number" ? value : fallback;
}

export const userConverter = {
  toFirestore(user: Omit<UserModel, "id">): Record<string, unknown> {
    return {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      birthYear: user.birthYear,
      generation: user.generation,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      introduction: user.introduction,
      registeredAt: user.registeredAt,
      teamId: user.teamId,
      teamName: user.teamName,
      cellId: user.cellId,
      cellName: user.cellName,
      ministry: user.ministry,
      position: user.position,
      isNewFamily: user.isNewFamily,
      role: user.role,
      approvalStatus: user.approvalStatus,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      profileCompleted: user.profileCompleted,
      statistics: user.statistics,
      lastLoginAt: user.lastLoginAt,
      approvedBy: user.approvedBy,
      approvedAt: user.approvedAt,
      rejectionReason: user.rejectionReason,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions,
  ): Omit<UserModel, "id"> {
    const data = snapshot.data(options);
    const statistics = (data.statistics as Record<string, unknown>) ?? {};
    return {
      email: (data.email as string) ?? null,
      displayName: (data.displayName as string) ?? null,
      photoURL: (data.photoURL as string) ?? null,
      birthYear: (data.birthYear as number) ?? null,
      generation: (data.generation as string) ?? null,
      gender: (data.gender as Gender) ?? null,
      phoneNumber: (data.phoneNumber as string) ?? null,
      introduction: (data.introduction as string) ?? null,
      registeredAt: (data.registeredAt as string) ?? null,
      teamId: (data.teamId as string) ?? null,
      teamName: (data.teamName as string) ?? null,
      cellId: (data.cellId as string) ?? null,
      cellName: (data.cellName as string) ?? null,
      ministry: (data.ministry as string) ?? null,
      position: (data.position as ChurchPosition) ?? ChurchPosition.NONE,
      isNewFamily: (data.isNewFamily as boolean) ?? false,
      role: (data.role as UserRole) ?? UserRole.USER,
      approvalStatus:
        (data.approvalStatus as ApprovalStatus) ?? ApprovalStatus.PENDING,
      isActive: (data.isActive as boolean) ?? true,
      emailVerified: (data.emailVerified as boolean) ?? false,
      profileCompleted: (data.profileCompleted as boolean) ?? false,
      statistics: {
        attendanceCount: num(statistics.attendanceCount),
        attendanceRate: num(statistics.attendanceRate),
        qtCount: num(statistics.qtCount),
        prayerCount: num(statistics.prayerCount),
      },
      lastLoginAt: (data.lastLoginAt as string) ?? null,
      approvedBy: (data.approvedBy as string) ?? null,
      approvedAt: (data.approvedAt as string) ?? null,
      rejectionReason: (data.rejectionReason as string) ?? null,
      createdAt: (data.createdAt as string) ?? new Date().toISOString(),
      updatedAt: (data.updatedAt as string) ?? new Date().toISOString(),
    };
  },
};
