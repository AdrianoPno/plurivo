import { AppError } from "@shared/utils/app-error.js";
import type { UserRole } from "@shared/types/user.js";
import type { TenantRepository } from "../tenants/tenant.repository.js";
import type { IUserRepository } from "./repositories/user.repository.js";
import type { IUpdateUserDTO, IUser } from "./types/usuario.types.js";

interface AuthUser {
  role: UserRole;
  tenantId?: string;
  unidadeId?: string;
}

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(uid: string, data: IUpdateUserDTO, currentUser: AuthUser): Promise<IUser> {
    const currentData = await this.userRepository.getById(uid);
    if (!currentData) throw new AppError("Usuario nao encontrado.", 404);

    if (currentUser.role !== "SUPER") {
      if (!currentUser.tenantId || currentData.tenantId !== currentUser.tenantId) {
        throw new AppError("Acesso negado: usuario de outra organizacao.", 403);
      }
      if (currentUser.unidadeId && currentData.unidadeId !== currentUser.unidadeId) {
        throw new AppError("Acesso negado: usuario fora da sua unidade.", 403);
      }
      if (currentData.role === "SUPER" || currentData.role === "ADMIN") {
        throw new AppError("Administrador nao pode alterar contas administrativas.", 403);
      }
      if (data.role && data.role !== "USER" && data.role !== "VIEWER") {
        throw new AppError("Administrador nao pode promover usuarios.", 403);
      }
      if (data.tenantId && data.tenantId !== currentUser.tenantId) {
        throw new AppError("Administrador nao pode mover usuarios entre organizacoes.", 403);
      }
    }

    if (data.role === "SUPER" && currentData.role !== "SUPER") {
      throw new AppError("Crie uma conta SUPER separada, sem organizacao.", 400);
    }

    const tenantId = data.tenantId ?? currentData.tenantId;
    const permissions = data.permissions ?? currentData.permissions;
    if (tenantId) {
      const tenant = await this.tenantRepository.getById(tenantId);
      if (!tenant || tenant.status !== "ACTIVE") {
        throw new AppError("Organizacao inativa ou nao encontrada.", 400);
      }
      if (permissions.some((permission) => !tenant.activeModules.includes(permission.moduleId))) {
        throw new AppError("Permissao informada para modulo nao contratado.", 400);
      }
    }

    const safeData: IUpdateUserDTO =
      currentUser.role === "SUPER"
        ? data
        : { ...data, tenantId: currentData.tenantId };
    await this.userRepository.update(uid, safeData);

    const updatedData = await this.userRepository.getById(uid);
    if (!updatedData) throw new AppError("Erro ao recuperar usuario atualizado.", 500);
    return updatedData;
  }
}
