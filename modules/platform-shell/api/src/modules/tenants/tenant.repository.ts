import type {
  CreateTenantInput,
  Tenant,
  UpdateTenantInput,
} from "@shared/types/tenant.js";

export interface TenantRepository {
  list(): Promise<Tenant[]>;
  getById(id: string): Promise<Tenant | null>;
  findBySlug(slug: string): Promise<Tenant | null>;
  create(data: CreateTenantInput): Promise<Tenant>;
  update(id: string, data: UpdateTenantInput): Promise<Tenant>;
}
