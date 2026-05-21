import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { adminAuth, firestore } from "../config/firebase.js";
import { UserRole, ModulePermission } from "@shared/types/user.js";

export const authPlugin = fp(async (app: FastifyInstance) => {
  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.status(401).send({
          success: false,
          message: "Token de autenticação não fornecido.",
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
            message: "Perfil de usuário não encontrado no sistema.",
          });
        }

        const userData = userDoc.data()!;

        // Anexa o perfil GLOBAL do usuário ao request
        request.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          nome: userData.nome,
          role: userData.role as UserRole, // Papel global
          permissions: (userData.permissions || []) as ModulePermission[],
          unidadeId: userData.unidadeId,
          unidadeNome: userData.unidadeNome,
        };
      } catch (error) {
        app.log.error(error, "Falha na verificação do token Firebase");
        return reply.status(401).send({
          success: false,
          message: "Sessão inválida ou expirada.",
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
            message: "Acesso negado: permissões insuficientes.",
          });
        }
      },
  );
});
