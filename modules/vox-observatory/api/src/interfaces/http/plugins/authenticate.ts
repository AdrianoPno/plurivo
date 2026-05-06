import fp from "fastify-plugin";
import type { FastifyReply, FastifyRequest } from "fastify";

export const authenticatePlugin = fp(async (fastify) => {
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.status(401).send({
          message: "Token inválido ou expirado.",
        });
      }
    },
  );
});
