import {
  UserRole,
  ROLE_HIERARCHY,
  hasRole as hasRoleBase,
  hasAnyRole as hasAnyRoleBase,
  isAdmin as isAdminBase,
  isLeader as isLeaderBase,
  isSuperAdmin as isSuperAdminBase,
} from "@/types/role";

function toRole(role: string): UserRole | null {
  return (Object.values(UserRole) as string[]).includes(role)
    ? (role as UserRole)
    : null;
}

export function hasRole(userRole: string, requiredRole: string): boolean {
  const u = toRole(userRole);
  const r = toRole(requiredRole);
  if (!u || !r) return false;
  return hasRoleBase(u, r);
}

export function hasAnyRole(userRole: string, requiredRoles: string[]): boolean {
  const u = toRole(userRole);
  if (!u) return false;
  const roles = requiredRoles
    .map(toRole)
    .filter((r): r is UserRole => r !== null);
  return hasAnyRoleBase(u, roles);
}

export function isAdmin(role: string): boolean {
  const u = toRole(role);
  return u ? isAdminBase(u) : false;
}

export function isLeader(role: string): boolean {
  const u = toRole(role);
  return u ? isLeaderBase(u) : false;
}

export function isSuperAdmin(role: string): boolean {
  const u = toRole(role);
  return u ? isSuperAdminBase(u) : false;
}

export { ROLE_HIERARCHY };
