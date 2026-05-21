import { adminAuth } from "../../config/firebase.js";
import { AppError } from "@shared/utils/app-error.js";

import { UserRole } from "@shared/types/user.js";
import { IUserRepository } from "./repositories/user.repository.js";
import { ICreateUserDTO, IUser } from "./types/usuario.types.js";

interface AuthUser {
  role: UserRole;
  unidadeId?: string;
}

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: ICreateUserDTO, currentUser: AuthUser): Promise<string> {
    const { email, password, nome, role, permissions } = data;

    if (
      currentUser.role === "ADMIN" &&
      (role === "SUPER" || role === "ADMIN")
    ) {
      throw new AppError(
        "ADMINs só podem criar usuários nível USER ou VIEWER.",
        403,
      );
    }

    const finalUnidadeId =
      currentUser.role === "SUPER" ? data.unidadeId : currentUser.unidadeId;
    if (!finalUnidadeId) {
      throw new AppError("Unidade de destino não identificada.", 400);
    }

    let authRecord;
    try {
      authRecord = await adminAuth.createUser({
        email,
        password,
        displayName: nome,
      });
    } catch (error: any) {
      if (error.code === "auth/email-already-exists") {
        throw new AppError("Este e-mail já está em uso.", 409);
      }
      throw new AppError("Erro ao criar credenciais de acesso.", 500);
    }

    try {
      const newUser: Omit<IUser, "id"> = {
        uid: authRecord.uid,
        nome,
        email,
        role,
        permissions: permissions || [],
        unidadeId: finalUnidadeId,
        ativo: true,
        createdAt: new Date(),
      };

      await this.userRepository.save(newUser);
      return authRecord.uid;
    } catch (dbError) {
      await adminAuth.deleteUser(authRecord.uid);
      // Log detalhado para o erro no DB
      console.error(
        `🔥 Fallback: Cadastro cancelado por erro no DB para UID ${authRecord.uid}. Erro:`,
        dbError,
      );
      throw new AppError(
        "Erro ao salvar perfil. O cadastro foi cancelado.",
        500,
      );
    }
  }
}
