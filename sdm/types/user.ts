import { UserRole } from "./role";
import {
  ApprovalStatus,
  ChurchPosition,
  Gender,
  type MemberStatistics,
} from "./member";

/**
 * The application-facing member profile. All date fields are ISO strings so the
 * profile is serializable across the Next.js server/client boundary.
 */
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;

  // Personal information
  birthYear: number | null;
  generation: string | null;
  gender: Gender | null;
  phoneNumber: string | null;
  introduction: string | null;

  // Church information
  registeredAt: string | null;
  teamId: string | null;
  teamName: string | null;
  cellId: string | null;
  cellName: string | null;
  ministry: string | null;
  position: ChurchPosition;
  isNewFamily: boolean;

  // Permissions
  role: UserRole;
  approvalStatus: ApprovalStatus;
  isActive: boolean;
  emailVerified: boolean;
  profileCompleted: boolean;

  // Statistics
  statistics: MemberStatistics;
  lastLoginAt: string | null;

  // Approval metadata
  approvedBy: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;

  // Audit
  createdAt: string;
  updatedAt: string;
}

/**
 * Fields a member may submit when completing their profile after sign-up.
 */
export interface CompleteProfileInput {
  displayName: string;
  birthYear: number;
  gender: Gender;
  phoneNumber: string;
  introduction?: string | null;
  photoURL?: string | null;
}

/**
 * Fields a member is allowed to edit on their own profile.
 */
export interface MemberEditableInput {
  phoneNumber?: string | null;
  photoURL?: string | null;
  introduction?: string | null;
}

/**
 * Fields only a Leader/Admin may change on a member.
 */
export interface PrivilegedEditableInput {
  teamId?: string | null;
  teamName?: string | null;
  cellId?: string | null;
  cellName?: string | null;
  ministry?: string | null;
  position?: ChurchPosition;
  role?: UserRole;
}
