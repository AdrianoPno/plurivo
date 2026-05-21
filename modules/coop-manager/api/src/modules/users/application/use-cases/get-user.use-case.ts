import { IUserRepository } from "../../domain/repositories/user.repository";
import { IUser } from "../../usuario.types";
import { AppError } from "@shared/utils/app-error";
import { UserRole } from "@shared/types/user";

interface AuthUser {
  role: UserRole;
  unidadeId?: string;
}

export class GetUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, currentUser: AuthUser): Promise<IUser> {
    const user = await this.userRepository.getById(id);

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    // Trava de segurança: ADMIN só vê usuários da sua própria unidade
    if (
      currentUser.role === "ADMIN" &&
      user.unidadeId !== currentUser.unidadeId
    ) {
      throw new AppError(
        "Acesso negado: este usuário pertence a outra unidade.",
        403,
      );
    }

    return user;
  }
}
