import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { adminAuth, db } from "../config/firebase.js";
import { MODULE_IDS } from "@shared/constants/modules.js";
import type { UserRole, ModulePermission } from "@shared/types/user.js";

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

        // Busca dados complementares do Firestore
        const userDoc = await db
          .collection("users")
          .doc(decodedToken.uid)
          .get();

        if (!userDoc.exists) {
          return reply.status(403).send({
            success: false,
            message: "Perfil de usuário não encontrado no sistema.",
          });
        }

        const userData = userDoc.data();

        if (userData?.ativo === false) {
          return reply.status(403).send({
            success: false,
            message: "Usuario inativo.",
          });
        }

        const userEmail = decodedToken.email; // Email vem do token
        const permissions = (userData?.permissions || []) as ModulePermission[];

        let unidadeNome: string | undefined = userData?.unidadeNome;
        // Se não tiver o nome da unidade no cache do user, busca na collection de unidades
        if (userData?.unidadeId && !unidadeNome) {
          const unidadeDoc = await db
            .collection("unidades")
            .doc(userData.unidadeId)
            .get();
          unidadeNome = unidadeDoc.data()?.nome;
        }

        // Determina a role para este módulo específico
        let effectiveRole: UserRole = (userData?.role as UserRole) || "USER";

        if (effectiveRole !== "SUPER") {
          const moduleAccess = permissions.find(
            (p) => p.moduleId === MODULE_IDS.COOP_MANAGER,
          );

          if (!moduleAccess) {
            return reply.status(403).send({
              success: false,
              message:
                "Acesso negado: você não tem permissão para acessar este módulo.",
            });
          }
          effectiveRole = moduleAccess.role;
        }

        // Anexa o usuário ao request (Module Augmentation já cobre os tipos)
        request.user = {
          uid: decodedToken.uid,
          email: userEmail,
          nome: userData?.nome,
          role: effectiveRole,
          permissions,
          unidadeId: userData?.unidadeId,
          unidadeNome: unidadeNome,
          ativo: userData?.ativo !== false,
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

  app.decorate("checkRoles", (allowedRoles: UserRole[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user;

      if (!user || !allowedRoles.includes(user.role)) {
        return reply.status(403).send({
          success: false,
          message: "Acesso negado: permissões insuficientes.",
        });
      }
    };
  });
});
