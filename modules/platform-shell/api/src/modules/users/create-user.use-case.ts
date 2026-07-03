import { adminAuth } from "../../config/firebase.js";
import { AppError } from "@shared/utils/app-error.js";
import type { UserRole } from "@shared/types/user.js";
import type { TenantRepository } from "../tenants/tenant.repository.js";
import type { IUserRepository } from "./repositories/user.repository.js";
import type { ICreateUserDTO, IUser } from "./types/usuario.types.js";

interface AuthUser {
  role: UserRole;
  tenantId?: string;
  unidadeId?: string;
}

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(data: ICreateUserDTO, currentUser: AuthUser): Promise<string> {
    if (currentUser.role !== "SUPER" && ["SUPER", "ADMIN"].includes(data.role)) {
      throw new AppError("Administradores podem criar apenas usuarios comuns.", 403);
    }

    const tenantId =
      data.role === "SUPER"
        ? undefined
        : currentUser.role === "SUPER"
          ? data.tenantId
          : currentUser.tenantId;

    if (data.role !== "SUPER" && !tenantId) {
      throw new AppError("Selecione a organizacao do usuario.", 400);
    }

    if (tenantId) {
      const tenant = await this.tenantRepository.getById(tenantId);
      if (!tenant || tenant.status !== "ACTIVE") {
        throw new AppError("Organizacao inativa ou nao encontrada.", 400);
      }
      const invalidPermission = data.permissions.some(
        (permission) => !tenant.activeModules.includes(permission.moduleId),
      );
      if (invalidPermission) {
        throw new AppError("Permissao informada para modulo nao contratado.", 400);
      }
    }

    let authRecord;
    try {
      authRecord = await adminAuth.createUser({
        email: data.email,
        password: data.password,
        displayName: data.nome,
      });
    } catch (error: unknown) {
      if ((error as { code?: string }).code === "auth/email-already-exists") {
        throw new AppError("Este e-mail ja esta em uso.", 409);
      }
      throw new AppError("Erro ao criar credenciais de acesso.", 500);
    }

    try {
      const unidadeId = currentUser.role === "SUPER" ? data.unidadeId : currentUser.unidadeId;
      const newUser: Omit<IUser, "id"> = {
        uid: authRecord.uid,
        nome: data.nome,
        email: data.email,
        role: data.role,
        permissions: data.role === "SUPER" ? [] : data.permissions,
        ativo: true,
        createdAt: new Date(),
        ...(tenantId ? { tenantId } : {}),
        ...(unidadeId ? { unidadeId } : {}),
      };
      await this.userRepository.save(newUser);
      return authRecord.uid;
    } catch (error) {
      await adminAuth.deleteUser(authRecord.uid);
      console.error("Cadastro cancelado por erro ao salvar perfil.", error);
      throw new AppError("Erro ao salvar perfil. O cadastro foi cancelado.", 500);
    }
  }
}
