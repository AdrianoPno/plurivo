import type { ModuleId } from "../constants/modules";

export type UserRole = "SUPER" | "ADMIN" | "USER" | "VIEWER";

export interface ModulePermission {
  moduleId: ModuleId;
  role: Exclude<UserRole, "SUPER">; // Role specific to the module
}

export interface IUser {
  id?: string;
  uid: string;
  nome: string;
  email?: string;
  tenantId?: string;
  unidadeId?: string;
  unidadeNome?: string;
  role: UserRole; // Global role
  permissions: ModulePermission[];
  ativo: boolean;
  status?: "ativo" | "inativo";
  createdAt?: unknown; // Can be Firestore Timestamp or Date
  updatedAt?: unknown; // Can be Firestore Timestamp or Date
}
