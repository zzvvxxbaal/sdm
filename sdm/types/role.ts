export enum UserRole {
  USER = "user",
  MEMBER = "member",
  LEADER = "leader",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export type UserRoleType = keyof typeof UserRole;

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.USER]: 1,
  [UserRole.MEMBER]: 2,
  [UserRole.LEADER]: 3,
  [UserRole.ADMIN]: 4,
  [UserRole.SUPER_ADMIN]: 5,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.USER]: "사용자",
  [UserRole.MEMBER]: "청년",
  [UserRole.LEADER]: "리더",
  [UserRole.ADMIN]: "관리자",
  [UserRole.SUPER_ADMIN]: "최고관리자",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  [UserRole.USER]: "#6B7280",
  [UserRole.MEMBER]: "#2563EB",
  [UserRole.LEADER]: "#0EA5E9",
  [UserRole.ADMIN]: "#F59E0B",
  [UserRole.SUPER_ADMIN]: "#EF4444",
};

export const ASSIGNABLE_ROLES: UserRole[] = [
  UserRole.USER,
  UserRole.MEMBER,
  UserRole.LEADER,
  UserRole.ADMIN,
];

export function hasRole(role: UserRole, required: UserRole): boolean {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[required];
}

export function hasAnyRole(role: UserRole, required: UserRole[]): boolean {
  return required.some((r) => hasRole(role, r));
}

export function isAdmin(role: UserRole): boolean {
  return hasRole(role, UserRole.ADMIN);
}

export function isLeader(role: UserRole): boolean {
  return hasRole(role, UserRole.LEADER);
}

export function isSuperAdmin(role: UserRole): boolean {
  return role === UserRole.SUPER_ADMIN;
}
