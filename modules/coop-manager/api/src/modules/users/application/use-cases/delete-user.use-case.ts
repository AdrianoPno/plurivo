import { adminAuth } from "../../../../config/firebase";
import { IUserRepository } from "../../user.repository";
import { AppError } from "@shared/utils/app-error";
import { UserRole } from "@shared/types/user";

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

    // Trava de segurança: ADMIN só deleta usuários da sua própria unidade
    if (
      currentUser.role === "ADMIN" &&
      userData.unidadeId !== currentUser.unidadeId
    ) {
      throw new AppError("Acesso negado.", 403);
    }

    // Deleta do Firestore através do repositório
    await this.userRepository.delete(uid);

    // Deleta do Firebase Authentication
    try {
      await adminAuth.deleteUser(uid);
    } catch (error: any) {
      // Se o usuário já foi removido do Auth por algum motivo, ignoramos o erro
      if (error.code !== "auth/user-not-found") {
        throw new AppError(
          "Falha ao remover as credenciais de acesso do usuário.",
          500,
        );
      }
    }
  }
}
