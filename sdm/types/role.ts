export enum UserRole {
  USER = "user",
  MEMBER = "member",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export type UserRoleType = keyof typeof UserRole;

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.USER]: 1,
  [UserRole.MEMBER]: 2,
  [UserRole.ADMIN]: 3,
  [UserRole.SUPER_ADMIN]: 4,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.USER]: "사용자",
  [UserRole.MEMBER]: "교회멤버",
  [UserRole.ADMIN]: "관리자",
  [UserRole.SUPER_ADMIN]: "최고관리자",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  [UserRole.USER]: "#6B7280",
  [UserRole.MEMBER]: "#3B82F6",
  [UserRole.ADMIN]: "#F59E0B",
  [UserRole.SUPER_ADMIN]: "#EF4444",
};

export function hasRole(role: UserRole, required: UserRole): boolean {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[required];
}

export function hasAnyRole(role: UserRole, required: UserRole[]): boolean {
  return required.some((r) => hasRole(role, r));
}
