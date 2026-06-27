import { UserRole } from "@/types/role";
import { ApprovalStatus, ChurchPosition, EMPTY_STATISTICS } from "@/types/member";
import type { UserModel } from "@/models/user";

/**
 * Builds the initial Firestore model for a newly authenticated user. New users
 * always start as an unprivileged USER with a PENDING approval status.
 */
export function buildInitialUserModel(params: {
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  timestamp: string;
}): Omit<UserModel, "id"> {
  const { email, displayName, photoURL, emailVerified, timestamp } = params;
  return {
    email,
    displayName,
    photoURL,
    birthYear: null,
    generation: null,
    gender: null,
    phoneNumber: null,
    introduction: null,
    registeredAt: timestamp,
    teamId: null,
    teamName: null,
    cellId: null,
    cellName: null,
    ministry: null,
    position: ChurchPosition.NONE,
    isNewFamily: true,
    role: UserRole.USER,
    approvalStatus: ApprovalStatus.PENDING,
    isActive: true,
    emailVerified,
    profileCompleted: false,
    statistics: { ...EMPTY_STATISTICS },
    lastLoginAt: timestamp,
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
