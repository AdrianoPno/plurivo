import "fastify";
import { UserRole, ModulePermission } from "@shared/types/user.js";

declare module "fastify" {
  // Interface para decorar a instância do Fastify (app)
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
    checkRoles: (
      roles: UserRole[],
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  // Interface para decorar o objeto de request
  interface FastifyRequest {
    user: {
      uid: string;
      email?: string;
      nome?: string;
      tenantId?: string;
      role: UserRole;
      permissions: ModulePermission[];
      ativo: boolean;
      unidadeId?: string;
      unidadeNome?: string;
    };
  }
}
