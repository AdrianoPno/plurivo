export const PERMISSIONS = {
  VIEW_DASHBOARD: "view_dashboard",
  VIEW_ANALYTICS: "view_analytics",
  MANAGE_SETTINGS: "manage_settings",
  MANAGE_USERS: "manage_users",
  VIEW_OBSERVATORY: "view_observatory",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
