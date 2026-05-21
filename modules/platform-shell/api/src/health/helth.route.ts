import { FastifyInstance } from "fastify";

export default async function healthRoutes(app: FastifyInstance) {
  app.get("/", async (req, reply) => {
    return reply.status(200).send({
      status: "active",
      message: "Platform Shell está ativa",
      uptime: process.uptime(),
    });
  });
}
