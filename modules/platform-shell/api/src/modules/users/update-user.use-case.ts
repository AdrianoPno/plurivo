import { AppError } from "@shared/utils/app-error.js";
import { UserRole } from "@shared/types/user.js";
import { IUserRepository } from "./repositories/user.repository.js";
import { IUpdateUserDTO } from "./types/usuario.types.js";

interface AuthUser {
  role: UserRole;
  unidadeId?: string;
}

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  // 1. Alterado o retorno de Promise<void> para Promise<any> para devolver os dados atualizados
  async execute(
    uid: string,
    data: IUpdateUserDTO,
    currentUser: AuthUser,
  ): Promise<any> {
    const currentData = await this.userRepository.getById(uid);

    if (!currentData) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    if (
      currentUser.role === "ADMIN" &&
      currentData.unidadeId !== currentUser.unidadeId
    ) {
      throw new AppError(
        "Acesso negado: este usuário pertence a outra unidade.",
        403,
      );
    }

    // 2. Executa a atualização no banco de dados
    await this.userRepository.update(uid, data);

    // 3. Busca o estado atual e consolidado do documento direto do Firestore
    const updatedData = await this.userRepository.getById(uid);

    if (!updatedData) {
      throw new AppError(
        "Erro ao recuperar os dados atualizados do usuário.",
        500,
      );
    }

    // 4. Retorna a entidade atualizada para o Controller poder responder ao Swagger
    return updatedData;
  }
}
