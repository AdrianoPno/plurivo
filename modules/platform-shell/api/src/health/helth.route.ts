import { FastifyInstance } from "fastify";

export default async function healthRoutes(app: FastifyInstance) {
  app.get("/", async (req, reply) => {
    return reply.status(200).send({
      status: "active",
      message: "Plurivo API esta ativa",
      uptime: process.uptime(),
    });
  });
}
