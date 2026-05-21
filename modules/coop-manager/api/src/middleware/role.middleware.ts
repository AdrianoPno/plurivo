import { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "@shared/utils/app-error.js";
import { UserRole } from "@shared/types/user";

/**
 * Middleware factory para verificar se o usuário possui uma das roles permitidas.
 * @param allowedRoles - Um array de roles que têm permissão para acessar a rota.
 */
export const checkRoles = (allowedRoles: Array<UserRole>) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new AppError("Acesso restrito a administradores.", 403);
    }
  };
};
