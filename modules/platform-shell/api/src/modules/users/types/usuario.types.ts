import { UserRole, ModulePermission } from "@shared/types/user.js";

/**
 * @openapi
 * components:
 *   schemas:
 *     UserRole:
 *       type: string
 *       enum: [SUPER, ADMIN, USER]
 *     IUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID do documento no Firestore (geralmente o mesmo que o UID).
 *           readOnly: true
 *         uid:
 *           type: string
 *           description: UID do usuário vindo do Firebase Authentication.
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         unidadeId:
 *           type: string
 *           description: ID da unidade à qual o usuário pertence.
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *         ativo:
 *           type: boolean
 */
export interface IUser {
  id?: string; // ID do documento no Firestore (mesmo que o UID)
  uid: string; // UID vindo do Firebase Auth
  nome: string;
  email: string;
  tenantId?: string;
  unidadeId?: string; // Chave mestra para o isolamento multi-tenant (opcional para SUPER)
  unidadeNome?: string; // Nome da unidade, populado pelo back-end para exibição no front-end
  role: UserRole;
  permissions: ModulePermission[]; // Nova estrutura de permissões por módulo
  ativo: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     ICreateUserDTO:
 *       type: object
 *       description: Dados para criação de um novo perfil de usuário. O campo 'unidadeId' é obrigatório para SUPER e inferido do admin logado para ADMIN.
 *       required:
 *         - nome
 *         - email
 *         - role
 *         - password
 *       properties:
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           description: Senha temporária para o novo usuário.
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *         unidadeId:
 *           type: string
 *           description: ID da unidade. Obrigatório se o requisitante for SUPER. Ignorado se for ADMIN.
 */
export interface ICreateUserDTO {
  nome: string;
  email: string;
  role: UserRole;
  password: string;
  permissions: ModulePermission[];
  tenantId?: string;
  unidadeId?: string; // Opcional, a lógica de serviço decide
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IUpdateUserDTO:
 *       type: object
 *       description: Dados para atualização de um usuário. Todos os campos são opcionais.
 *       properties:
 *         nome:
 *           type: string
 *         unidadeId:
 *           type: string
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *         ativo:
 *           type: boolean
 */
export type IUpdateUserDTO = Partial<Omit<IUser, "id" | "uid" | "createdAt">>;
