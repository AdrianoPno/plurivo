export interface PlatformModule {
  id: string;
  name: string;
  description?: string;
  path: string;
  enabled: boolean;
  port?: number;
  icon?: string;
  healthEndpoint?: string;
  docsUrl?: string;
  requiredRoles?: string[];
}
