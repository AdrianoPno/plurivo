import "fastify";
import { UserRole, ModulePermission } from "@shared/types/user";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
    checkRoles: (
      roles: ("SUPER" | "ADMIN" | "USER")[],
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    user: {
      uid: string;
      role: UserRole;
      unidadeId?: string;
    };
  }
}
