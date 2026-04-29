import { FastifyRequest, FastifyReply } from "fastify";
import { JWT, VerifyOptions } from "@fastify/jwt";

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

  interface FastifyRequest {
    jwt: JWT;
    jwtVerify(options?: VerifyOptions): Promise<void>;
    user: {
      id: string;
      email: string;
      // Outras propriedades do payload do JWT podem ser adicionadas aqui
    };
  }
}
