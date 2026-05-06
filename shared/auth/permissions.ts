import { PERMISSIONS, type Permission } from "../constants/permissions";
import { ROLES, type Role } from "./roles";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_OBSERVATORY,
  ],

  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_OBSERVATORY,
  ],

  [ROLES.USER]: [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.VIEW_OBSERVATORY],
};

export function hasPermission(role: Role, permission: Permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
