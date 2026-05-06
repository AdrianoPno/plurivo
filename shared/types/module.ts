export interface PlatformModule {
  id: string;
  name: string;
  description?: string;
  path: string;
  enabled: boolean;
  icon?: string;
  requiredRoles?: string[];
}
