import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { DashboardController } from "./dashboard.controller";

export default async function dashboardRoutes(app: FastifyInstance) {
  const controller = new DashboardController();
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.addHook("preHandler", app.authenticate);

  typedApp.get(
    "/stats",
    {
      schema: {
        summary: "Retorna estatísticas e KPIs para o dashboard",
        description:
          "Busca dados agregados como contagem de alertas e novos cooperados. Escopo definido pela role.",
        tags: ["Dashboard"],
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            success: z.boolean(),
            data: z.record(z.any()),
            message: z.string().optional(),
          }),
        },
      },
    },
    (req, reply) => controller.getStats(req, reply),
  );
}
