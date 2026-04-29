import { FastifyRequest, FastifyReply } from "fastify";
import { JWT } from "@fastify/jwt";
import "@fastify/jwt";

// Declaração de módulo para estender as interfaces do Fastify
declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }

  interface FastifyReply {
    jwtSign(
      payload: Parameters<JWT["sign"]>[0],
      options?: Parameters<JWT["sign"]>[1],
    ): Promise<string>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      id: string;
      email: string;
      role: "ADMIN" | "VIEWER" | "SUPER";
      status: "ativo" | "inativo";
    }; // payload type is used for signing
    user: {
      id: string; // uid do Firebase
      email: string;
      role: "ADMIN" | "VIEWER" | "SUPER";
      status: "ativo" | "inativo";
    }; // user type is the return type of `request.user`
  }
}
