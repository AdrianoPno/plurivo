import { IUserRepository } from "../../domain/repositories/user.repository.js";
import { IUpdateUserDTO } from "../../usuario.types.js";
import { AppError } from "@shared/utils/app-error.js";
import { UserRole } from "@shared/types/user.js";

interface AuthUser {
  role: UserRole;
  unidadeId?: string;
}

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    uid: string,
    data: IUpdateUserDTO,
    currentUser: AuthUser,
  ): Promise<void> {
    const currentData = await this.userRepository.getById(uid);

    if (!currentData) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    // Trava de segurança: ADMIN só edita usuários da sua própria unidade
    if (
      currentUser.role === "ADMIN" &&
      currentData.unidadeId !== currentUser.unidadeId
    ) {
      throw new AppError(
        "Acesso negado: este usuário pertence a outra unidade.",
        403,
      );
    }

    await this.userRepository.update(uid, data);
  }
}
