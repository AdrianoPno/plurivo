import "fastify";

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: import("fastify").preHandlerAsyncHookHandler;
  }
}
