import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import fastifyJwt, { JWT, VerifyOptions } from "@fastify/jwt";
import { AppError } from "@shared/utils/app-error.js";

/**
 * Define o formato esperado do payload dentro do JWT.
 * Este tipo deve ser consistente com o que o `platform-shell` gera.
 */
export interface IUserPayload {
  sub: string; // uid do usuário
  name: string;
  email: string;
  role: "SUPER" | "ADMIN" | "USER" | "VIEWER";
  unidadeId?: string;
}

// Estende as interfaces do Fastify para incluir as novas propriedades
declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
    user: IUserPayload;
    jwtVerify(options?: VerifyOptions): Promise<IUserPayload>;
  }
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}

// Estende a interface do @fastify/jwt para tipar o payload
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: IUserPayload;
    user: IUserPayload;
  }
}

export const authenticatePlugin = fp(async (fastify: FastifyInstance) => {
  // 1. Registra o plugin @fastify/jwt, que adiciona o método `jwtVerify` ao request
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET as string,
  });

  // 2. Decora a instância do Fastify com um hook `authenticate`
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Agora o `jwtVerify` existe e está corretamente tipado
        await request.jwtVerify();
      } catch (err) {
        // Lança um erro padronizado que será capturado pelo errorHandler global
        throw new AppError("Token de autenticação inválido ou expirado.", 401);
      }
    },
  );
});
