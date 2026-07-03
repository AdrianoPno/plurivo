import { AppError } from "@shared/utils/app-error.js";
import type { UserRole } from "@shared/types/user.js";
import type { IUserRepository } from "./repositories/user.repository.js";
import type { IUser } from "./types/usuario.types.js";

interface AuthUser {
  role: UserRole;
  tenantId?: string;
  unidadeId?: string;
}

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, currentUser: AuthUser): Promise<IUser> {
    const user = await this.userRepository.getById(id);
    if (!user) throw new AppError("Usuario nao encontrado.", 404);

    if (
      currentUser.role !== "SUPER" &&
      (!currentUser.tenantId || user.tenantId !== currentUser.tenantId)
    ) {
      throw new AppError("Acesso negado: usuario de outra organizacao.", 403);
    }

    if (
      currentUser.role !== "SUPER" &&
      currentUser.unidadeId &&
      user.unidadeId !== currentUser.unidadeId
    ) {
      throw new AppError("Acesso negado: usuario fora da sua unidade.", 403);
    }

    return user;
  }
}
