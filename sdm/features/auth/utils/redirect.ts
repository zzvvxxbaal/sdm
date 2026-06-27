import { ROUTES } from "@/constants/routes";
import { ApprovalStatus } from "@/types/member";
import type { UserProfile } from "@/types/user";

/**
 * Resolves where an authenticated user should be sent based on the state of
 * their onboarding (email verification -> profile completion -> admin approval).
 * Returns `null` when the user has cleared every gate and may access the app.
 */
export function resolveAuthDestination(user: UserProfile): string | null {
  if (!user.emailVerified) return ROUTES.VERIFY_EMAIL;
  if (!user.profileCompleted) return ROUTES.COMPLETE_PROFILE;
  if (user.approvalStatus !== ApprovalStatus.APPROVED) {
    return ROUTES.PENDING_APPROVAL;
  }
  if (!user.isActive) return ROUTES.PENDING_APPROVAL;
  return null;
}

/**
 * Whether the user has fully cleared onboarding and is an active, approved
 * member who may use protected features.
 */
export function isFullyApproved(user: UserProfile): boolean {
  return resolveAuthDestination(user) === null;
}
