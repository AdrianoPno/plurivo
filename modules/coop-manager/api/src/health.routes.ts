import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export default async function healthRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.get(
    "/",
    {
      schema: {
        tags: ["Health"],
      },
    },
    async (_req, reply) => {
      return reply.status(200).send({
        status: "active",
        message: "People API esta ativa",
        uptime: process.uptime(),
      });
    },
  );
}
