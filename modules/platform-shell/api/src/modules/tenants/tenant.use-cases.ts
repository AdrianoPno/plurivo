import type {
  CreateTenantInput,
  Tenant,
  UpdateTenantInput,
} from "@shared/types/tenant.js";
import { AppError } from "@shared/utils/app-error.js";
import type { TenantRepository } from "./tenant.repository.js";

export class ListTenantsUseCase {
  constructor(private readonly repository: TenantRepository) {}
  execute(): Promise<Tenant[]> {
    return this.repository.list();
  }
}

export class GetTenantUseCase {
  constructor(private readonly repository: TenantRepository) {}
  async execute(id: string): Promise<Tenant> {
    const tenant = await this.repository.getById(id);
    if (!tenant) throw new AppError("Organizacao nao encontrada.", 404);
    return tenant;
  }
}

export class CreateTenantUseCase {
  constructor(private readonly repository: TenantRepository) {}
  async execute(data: CreateTenantInput): Promise<Tenant> {
    if (await this.repository.findBySlug(data.slug)) {
      throw new AppError("Ja existe uma organizacao com este identificador.", 409);
    }
    return this.repository.create(data);
  }
}

export class UpdateTenantUseCase {
  constructor(private readonly repository: TenantRepository) {}
  async execute(id: string, data: UpdateTenantInput): Promise<Tenant> {
    const current = await this.repository.getById(id);
    if (!current) throw new AppError("Organizacao nao encontrada.", 404);
    if (data.slug && data.slug !== current.slug) {
      const duplicate = await this.repository.findBySlug(data.slug);
      if (duplicate && duplicate.id !== id) {
        throw new AppError("Ja existe uma organizacao com este identificador.", 409);
      }
    }
    return this.repository.update(id, data);
  }
}
