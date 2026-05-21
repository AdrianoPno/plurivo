import { adminAuth } from "../../config/firebase";
import { AppError } from "@shared/utils/app-error";
import { IUser, ICreateUserDTO, IUpdateUserDTO } from "./usuario.types";
import logger from "../../config/logger";
import { UserRole, ModulePermission } from "@shared/types/user";
import { FirestoreUserRepository } from "./application/use-cases/firestore-user.repository";

interface AuthUser {
  uid: string;
  role: UserRole;
  permissions: ModulePermission[];
  unidadeId?: string;
}

export class UsersService {
  private userRepository = new FirestoreUserRepository();

  async list(user: AuthUser): Promise<IUser[]> {
    // Lógica multi-tenant: Admin vê apenas sua unidade
    const filtroUnidade = user.role === "ADMIN" ? user.unidadeId : undefined;
    if (user.role === "ADMIN" && !filtroUnidade)
      throw new AppError("Admin sem unidade.", 400);

    return this.userRepository.list(filtroUnidade);
  }

  async getById(id: string, user: AuthUser): Promise<IUser> {
    const userData = await this.userRepository.getById(id);

    if (!userData) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    // Trava Multi-tenant: SUPER ignora, ADMIN só pode ver se for da mesma unidade
    if (user.role === "ADMIN" && userData.unidadeId !== user.unidadeId) {
      throw new AppError(
        "Acesso negado: este usuário pertence a outra unidade.",
        403,
      );
    }

    return userData;
  }

  async create(data: ICreateUserDTO, user: AuthUser): Promise<string> {
    const { email, password, nome, role, permissions } = data;

    // 1. Regra de Negócio: Hierarquia
    if (user.role === "ADMIN" && (role === "SUPER" || role === "ADMIN")) {
      throw new AppError(
        "ADMINs só podem criar usuários nível USER ou VIEWER.",
        403,
      );
    }

    // 2. Determinação da Unidade
    const finalUnidadeId =
      user.role === "SUPER" ? data.unidadeId : user.unidadeId;
    if (!finalUnidadeId) {
      throw new AppError("Unidade de destino não identificada.", 400);
    }

    // 3. Operação Atômica: Auth First
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

    // 4. Firestore Second + Rollback
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
      // ROLLBACK: Limpa o Auth se o banco falhar
      await adminAuth.deleteUser(authRecord.uid);
      logger.error(
        { uid: authRecord.uid, err: dbError },
        "🔥 Falha no Firestore. Rollback no Auth executado.",
      );
      throw new AppError(
        "Erro ao salvar perfil. O cadastro foi cancelado.",
        500,
      );
    }
  }

  async update(
    uid: string,
    data: IUpdateUserDTO,
    user: AuthUser,
  ): Promise<void> {
    const currentData = await this.userRepository.getById(uid);

    if (!currentData) throw new AppError("Usuário não encontrado.", 404);

    // Trava Multi-tenant: SUPER ignora, ADMIN só edita se for da mesma unidade
    if (user.role === "ADMIN" && currentData?.unidadeId !== user.unidadeId) {
      throw new AppError(
        "Acesso negado: este usuário pertence a outra unidade.",
        403,
      );
    }

    await this.userRepository.update(uid, data);
  }

  async delete(uid: string, user: AuthUser): Promise<void> {
    const userData = await this.userRepository.getById(uid);

    if (!userData) throw new AppError("Usuário não encontrado.", 404);

    // Trava de segurança para exclusão
    if (user.role === "ADMIN" && userData.unidadeId !== user.unidadeId) {
      throw new AppError("Acesso negado.", 403);
    }

    // Deleta do Firestore
    await this.userRepository.delete(uid);

    // Deleta do Firebase Auth (Tenta, se falhar porque já não existe, ignora)
    try {
      await adminAuth.deleteUser(uid);
    } catch (error: any) {
      if (error.code !== "auth/user-not-found") {
        throw new AppError("Falha ao remover o usuário da autenticação.", 500);
      }
    }
  }
}
