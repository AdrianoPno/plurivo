import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function healthRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.get(
    "/health",
    {
      schema: {
        description: "Retorna o status de saúde da Vox Observatory API",
        tags: ["Health"],
        response: {
          200: z.object({
            status: z.string(),
            message: z.string(),
            uptime: z.number(),
          }),
        },
      },
    },
    async () => ({
      status: "active",
      message: "Research API esta ativa",
      uptime: process.uptime(),
    }),
  );
}
