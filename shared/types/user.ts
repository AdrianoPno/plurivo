import { ModuleID } from "../constants/modules";

// Roles disponíveis no sistema
export type UserRole = "SUPER" | "ADMIN" | "VIEWER" | "USER";

export type UserStatus = "ativo" | "inativo";

/**
 * Define o acesso específico a um módulo.
 */
export interface ModulePermission {
  moduleId: ModuleID;
  role: "ADMIN" | "VIEWER" | "USER";
}

export interface UserProps {
  uid: string;
  nome: string;
  email: string;
  role: UserRole; // Role principal/global (ex: SUPER)
  permissions: ModulePermission[]; // Permissões granulares por módulo
  status: UserStatus;
}

export class User {
  constructor(public props: UserProps) {}

  get uid() {
    return this.props.uid;
  }

  get nome() {
    return this.props.nome;
  }

  get email() {
    return this.props.email;
  }

  get role() {
    return this.props.role;
  }

  get status() {
    return this.props.status;
  }

  isActive() {
    return this.props.status === "ativo";
  }

  isAdmin() {
    return this.props.role === "ADMIN";
  }

  /**
   * Verifica se o usuário é o administrador global do sistema.
   */
  isSuper() {
    return this.props.role === "SUPER";
  }

  /**
   * Verifica se o usuário tem acesso a um módulo específico.
   * Se for SUPER, tem acesso a tudo.
   */
  hasModuleAccess(moduleId: ModuleID): boolean {
    if (this.isSuper()) return true;
    return this.props.permissions.some((p) => p.moduleId === moduleId);
  }

  /**
   * Retorna a role do usuário dentro de um módulo específico.
   */
  getRoleInModule(moduleId: ModuleID): UserRole {
    if (this.isSuper()) return "SUPER";

    const permission = this.props.permissions.find(
      (p) => p.moduleId === moduleId,
    );
    return permission ? permission.role : "USER";
  }
}
