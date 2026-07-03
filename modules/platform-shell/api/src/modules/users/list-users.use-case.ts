import { AppError } from "@shared/utils/app-error.js";
import type { UserRole } from "@shared/types/user.js";
import type { IUserRepository } from "./repositories/user.repository.js";
import type { IUser } from "./types/usuario.types.js";

interface AuthUser {
  role: UserRole;
  tenantId?: string;
  unidadeId?: string;
}

export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(currentUser: AuthUser): Promise<IUser[]> {
    if (currentUser.role === "SUPER") return this.userRepository.list();

    if (!currentUser.tenantId) {
      throw new AppError("Administrador sem organizacao vinculada.", 403);
    }

    return this.userRepository.list({
      tenantId: currentUser.tenantId,
      unidadeId: currentUser.unidadeId,
    });
  }
}
