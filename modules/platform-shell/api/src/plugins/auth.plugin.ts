import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

import { adminAuth, firestore } from "../config/firebase.js";
import type { ModulePermission, UserRole } from "@shared/types/user.js";

export const authPlugin = fp(async (app: FastifyInstance) => {
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
        const decodedToken = await adminAuth.verifyIdToken(token);

        const userDoc = await firestore
          .collection("users")
          .doc(decodedToken.uid)
          .get();

        if (!userDoc.exists) {
          return reply.status(403).send({
            success: false,
            message: "Perfil de usuario nao encontrado no sistema.",
          });
        }

        const userData = userDoc.data()!;

        if (userData.ativo === false) {
          return reply.status(403).send({
            success: false,
            message: "Usuario inativo.",
          });
        }

        request.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          nome: userData.nome,
          role: userData.role as UserRole,
          permissions: (userData.permissions || []) as ModulePermission[],
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

  app.decorate(
    "checkRoles",
    (allowedRoles: UserRole[]) =>
      async (request: FastifyRequest, reply: FastifyReply) => {
        const user = request.user;

        if (!user || !allowedRoles.includes(user.role)) {
          return reply.status(403).send({
            success: false,
            message: "Acesso negado: permissoes insuficientes.",
          });
        }
      },
  );
});
