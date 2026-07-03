import type { ModuleId } from "../constants/modules";

export type TenantStatus = "ACTIVE" | "INACTIVE";

export interface TenantBranding {
  displayName: string;
  logoUrl?: string;
  primaryColor?: string;
}

export interface Tenant {
  id: string;
  slug: string;
  legalName: string;
  branding: TenantBranding;
  activeModules: ModuleId[];
  status: TenantStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTenantInput = Omit<
  Tenant,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateTenantInput = Partial<
  Omit<Tenant, "id" | "createdAt" | "updatedAt">
>;
