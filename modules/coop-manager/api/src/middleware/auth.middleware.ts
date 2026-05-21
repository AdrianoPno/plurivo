import { adminAuth, db } from "../config/firebase";
import logger from "../config/logger";
import { FastifyReply, FastifyRequest } from "fastify";
import { UserRole, ModulePermission } from "@shared/types/user";

// Tipagem alinhada com as necessidades do Service e Controller
declare module "fastify" {
  interface FastifyRequest {
    user: {
      uid: string;
      email?: string;
      role: UserRole;
      unidadeId?: string;
      unidadeNome?: string;
      nome?: string;
      permissions: ModulePermission[];
    };
  }
}

export const authMiddleware = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    reply.status(401).send({ error: "Token não fornecido" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Busca dados do usuário
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      reply.status(403).send({ error: "Perfil de usuário não encontrado" });
      return;
    }

    const userData = userDoc.data();
    let unidadeNome = userData?.unidadeNome; // Tenta pegar do cache do user primeiro

    // Se não tiver o nome no cache do user, busca na collection de unidades
    if (userData?.unidadeId && !unidadeNome) {
      const unidadeDoc = await db
        .collection("unidades")
        .doc(userData.unidadeId)
        .get();
      unidadeNome = unidadeDoc.data()?.nome;
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      nome: userData?.nome, // Adicionado para o Topbar
      role: (userData?.role as UserRole) || "USER",
      unidadeId: userData?.unidadeId,
      unidadeNome: unidadeNome,
      permissions: (userData?.permissions || []) as ModulePermission[],
    };
  } catch (error) {
    logger.error(
      { err: error },
      "🔥 Falha na verificação do token de autenticação",
    );
    reply.status(401).send({ error: "Token inválido ou expirado" });
  }
};
