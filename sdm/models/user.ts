import { z } from "zod";
import { UserRole } from "@/types/role";
import type { FirestoreBase } from "@/types/firestore";

export const userSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().min(1).max(50),
  photoURL: z.string().url().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  role: z.nativeEnum(UserRole),
  generation: z.string().nullable().optional(),
  ministry: z.string().nullable().optional(),
  cellGroup: z.string().nullable().optional(),
  birthDate: z.string().nullable().optional(),
  gender: z.enum(["male", "female"]).nullable().optional(),
  address: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  lastLoginAt: z.string().nullable().optional(),
  createdAt: z.any(),
  updatedAt: z.any(),
  createdBy: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});

export type User = z.infer<typeof userSchema>;

export interface UserModel extends FirestoreBase {
  email: string;
  displayName: string;
  photoURL: string | null;
  phoneNumber: string | null;
  role: UserRole;
  generation: string | null;
  ministry: string | null;
  cellGroup: string | null;
  birthDate: string | null;
  gender: "male" | "female" | null;
  address: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
}

export const userConverter = {
  toFirestore(user: Omit<UserModel, "id">): Record<string, unknown> {
    return {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      role: user.role,
      generation: user.generation,
      ministry: user.ministry,
      cellGroup: user.cellGroup,
      birthDate: user.birthDate,
      gender: user.gender,
      address: user.address,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      createdBy: user.createdBy,
      updatedBy: user.updatedBy,
    };
  },
  fromFirestore(data: Record<string, unknown>): Omit<UserModel, "id"> {
    return {
      email: data.email as string,
      displayName: data.displayName as string,
      photoURL: (data.photoURL as string) ?? null,
      phoneNumber: (data.phoneNumber as string) ?? null,
      role: data.role as UserRole,
      generation: (data.generation as string) ?? null,
      ministry: (data.ministry as string) ?? null,
      cellGroup: (data.cellGroup as string) ?? null,
      birthDate: (data.birthDate as string) ?? null,
      gender: (data.gender as "male" | "female") ?? null,
      address: (data.address as string) ?? null,
      isActive: (data.isActive as boolean) ?? true,
      lastLoginAt: (data.lastLoginAt as string) ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: (data.createdBy as string) ?? null,
      updatedBy: (data.updatedBy as string) ?? null,
    };
  },
};
