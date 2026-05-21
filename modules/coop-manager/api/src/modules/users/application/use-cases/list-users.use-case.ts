import { IUserRepository } from "../../domain/repositories/user.repository";
import { IUser } from "../../usuario.types";
import { AppError } from "@shared/utils/app-error";
import { UserRole } from "@shared/types/user";

interface AuthUser {
  role: UserRole;
  unidadeId?: string;
}

export class ListUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(currentUser: AuthUser): Promise<IUser[]> {
    // Lógica multi-tenant: ADMIN vê apenas sua unidade, SUPER vê tudo
    const filtroUnidade =
      currentUser.role === "ADMIN" ? currentUser.unidadeId : undefined;

    if (currentUser.role === "ADMIN" && !filtroUnidade) {
      throw new AppError("Administrador sem unidade vinculada.", 400);
    }

    return this.userRepository.list(filtroUnidade);
  }
}
