import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

import { MODULE_IDS } from "@shared/constants/modules.js";
import type { ModulePermission, UserRole } from "@shared/types/user.js";

import { adminAuth, db } from "@/infra/config/firebase.js";

export interface AuthenticatedUser {
  id: string;
  uid: string;
  email?: string;
  nome?: string;
  role: UserRole;
  globalRole: UserRole;
  permissions: ModulePermission[];
  ativo: boolean;
  unidadeId?: string;
  unidadeNome?: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user: AuthenticatedUser;
  }

  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}

export const authenticatePlugin = fp(async (app: FastifyInstance) => {
  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.status(401).send({
          success: false,
          message: "Token de autenticacao nao fornecido.",
        });
      }

      const token = authHeader.split(" ")[1];

      try {
        const decodedToken = await adminAuth.verifyIdToken(token, true);
        const userDoc = await db.collection("users").doc(decodedToken.uid).get();

        if (!userDoc.exists) {
          return reply.status(403).send({
            success: false,
            message: "Perfil de usuario nao encontrado no sistema.",
          });
        }

        const userData = userDoc.data()!;

        if (userData.ativo === false || userData.status === "inativo") {
          return reply.status(403).send({
            success: false,
            message: "Usuario inativo.",
          });
        }

        const globalRole = (userData.role || "USER") as UserRole;
        const permissions = (userData.permissions || []) as ModulePermission[];
        const moduleAccess = permissions.find(
          (permission) => permission.moduleId === MODULE_IDS.VOX_OBSERVATORY,
        );

        if (globalRole !== "SUPER" && !moduleAccess) {
          return reply.status(403).send({
            success: false,
            message: "Acesso negado ao modulo Vox Observatory.",
          });
        }

        request.user = {
          id: decodedToken.uid,
          uid: decodedToken.uid,
          email: decodedToken.email,
          nome: userData.nome,
          role: globalRole === "SUPER" ? "SUPER" : moduleAccess!.role,
          globalRole,
          permissions,
          ativo: userData.ativo !== false,
          unidadeId: userData.unidadeId,
          unidadeNome: userData.unidadeNome,
        };
      } catch (error) {
        app.log.error(error, "Falha na verificacao do token Firebase");
        return reply.status(401).send({
          success: false,
          message: "Sessao invalida ou expirada.",
        });
      }
    },
  );
});
