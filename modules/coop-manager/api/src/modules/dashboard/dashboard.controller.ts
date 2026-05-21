import { FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { DashboardService } from "./dashboard.service";
import logger from "../../config/logger";

export class DashboardController {
  private dashboardService = new DashboardService();

  async getStats(req: FastifyRequest, reply: FastifyReply) {
    try {
      // O service usa o req.user para determinar o escopo dos dados (global ou por unidade)
      const stats = await this.dashboardService.getDashboardStats(req.user);

      return reply.status(200).send({
        success: true,
        data: stats,
        message: "Estatísticas do dashboard recuperadas com sucesso.",
      });
    } catch (error: any) {
      logger.error({ err: error }, "Erro ao buscar estatísticas do dashboard");
      return reply.status(500).send({
        success: false,
        message: error.message || "Erro interno ao processar estatísticas.",
      });
    }
  }
}
