import "fastify";
import type { AuthenticatedUser } from "../interfaces/http/plugins/authenticate.js";

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: import("fastify").preHandlerAsyncHookHandler;
  }

  export interface FastifyRequest {
    user: AuthenticatedUser;
  }
}
