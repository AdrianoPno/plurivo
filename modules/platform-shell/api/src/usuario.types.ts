import { IUser, UserRole, ModulePermission } from "@shared/types/user.js";

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
