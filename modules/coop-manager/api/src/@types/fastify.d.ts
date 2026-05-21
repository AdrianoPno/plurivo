import "fastify";
import { UserRole, ModulePermission } from "@shared/types/user";

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
      unidadeId?: string;
    };
  }
}
