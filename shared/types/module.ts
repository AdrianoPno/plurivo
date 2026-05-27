import { ModuleId } from "@shared/constants/modules";

export interface PlatformModule {
  id: ModuleId;
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
