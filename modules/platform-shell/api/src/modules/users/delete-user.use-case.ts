import { AppError } from "@shared/utils/app-error.js";
import type { UserRole } from "@shared/types/user.js";
import { adminAuth } from "../../config/firebase.js";
import type { IUserRepository } from "./repositories/user.repository.js";

interface AuthUser {
  uid: string;
  role: UserRole;
  tenantId?: string;
  unidadeId?: string;
}

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(uid: string, currentUser: AuthUser): Promise<void> {
    if (uid === currentUser.uid) throw new AppError("Voce nao pode excluir sua propria conta.", 400);

    const user = await this.userRepository.getById(uid);
    if (!user) throw new AppError("Usuario nao encontrado.", 404);

    if (currentUser.role !== "SUPER") {
      if (!currentUser.tenantId || user.tenantId !== currentUser.tenantId) {
        throw new AppError("Acesso negado: usuario de outra organizacao.", 403);
      }
      if (currentUser.unidadeId && user.unidadeId !== currentUser.unidadeId) {
        throw new AppError("Acesso negado: usuario fora da sua unidade.", 403);
      }
      if (user.role === "SUPER" || user.role === "ADMIN") {
        throw new AppError("Administrador nao pode excluir contas administrativas.", 403);
      }
    }

    await this.userRepository.delete(uid);
    try {
      await adminAuth.deleteUser(uid);
    } catch (error: unknown) {
      if ((error as { code?: string }).code !== "auth/user-not-found") {
        throw new AppError("Falha ao remover as credenciais do usuario.", 500);
      }
    }
  }
}
