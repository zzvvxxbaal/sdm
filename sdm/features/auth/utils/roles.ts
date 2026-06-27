import { UserRole } from "@/types/auth";
import type { UserRoleValue } from "@/constants/auth";

const ROLE_HIERARCHY: Record<string, number> = {
  [UserRole.USER]: 1,
  [UserRole.MEMBER]: 2,
  [UserRole.ADMIN]: 3,
  [UserRole.SUPER_ADMIN]: 4,
};

export function hasRole(userRole: string, requiredRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0;
  return userLevel >= requiredLevel;
}

export function hasAnyRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.some((role) => hasRole(userRole, role));
}

export function isAdmin(role: string): boolean {
  return hasRole(role, UserRole.ADMIN);
}

export function isSuperAdmin(role: string): boolean {
  return role === UserRole.SUPER_ADMIN;
}
