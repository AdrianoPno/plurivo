import { AppError } from "@shared/utils/app-error.js";
import { UserRole } from "@shared/types/user.js";
import { IUserRepository } from "./repositories/user.repository.js";
import { IUser } from "./types/usuario.types.js";

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
