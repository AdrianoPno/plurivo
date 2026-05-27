import "fastify";
import type { UserRole, ModulePermission } from "@shared/types/user.js";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
    checkRoles: (
      roles: UserRole[],
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    user: {
      uid: string;
      role: UserRole;
      email?: string; // Adicionado
      nome?: string; // Adicionado
      unidadeNome?: string; // Adicionado
      permissions: ModulePermission[];
      ativo: boolean;
      unidadeId?: string;
    };
  }
}
