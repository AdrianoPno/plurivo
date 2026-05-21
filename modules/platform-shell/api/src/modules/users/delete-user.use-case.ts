import { AppError } from "@shared/utils/app-error.js";
import { UserRole } from "@shared/types/user.js";
import { adminAuth } from "../../config/firebase.js";
import { IUserRepository } from "./repositories/user.repository.js";

interface AuthUser {
  role: UserRole;
  unidadeId?: string;
}

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(uid: string, currentUser: AuthUser): Promise<void> {
    const userData = await this.userRepository.getById(uid);

    if (!userData) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    if (
      currentUser.role === "ADMIN" &&
      userData.unidadeId !== currentUser.unidadeId
    ) {
      throw new AppError("Acesso negado.", 403);
    }

    await this.userRepository.delete(uid);

    try {
      await adminAuth.deleteUser(uid);
    } catch (error: any) {
      if (error.code !== "auth/user-not-found") {
        throw new AppError(
          "Falha ao remover as credenciais de acesso do usuário.",
          500,
        );
      }
    }
  }
}
