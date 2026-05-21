import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { CooperadosController } from "./cooperados.controller.js";
import {
  getCooperadoSchema,
  createCooperadoSchema,
  updateCooperadoSchema,
  deleteCooperadoSchema,
} from "../../utils/cooperados.schema.js";

export default async function cooperadosRoutes(
  app: FastifyInstance<any, any, any, any>,
) {
  const controller = new CooperadosController();
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.addHook("preHandler", app.authenticate);

  /**
   * @openapi
   * /cooperados:
   *   get:
   *     summary: Lista todos os cooperados
   *     tags: [Cooperados]
   *     responses:
   *       200:
   *         description: Lista retornada com sucesso
   */
  typedApp.get(
    "/",
    {
      schema: {
        summary: "Lista todos os cooperados",
        tags: ["Cooperados"],
      },
      preHandler: [app.checkRoles(["SUPER", "ADMIN"])],
    },
    (req, reply) => controller.index(req, reply),
  );

  typedApp.get(
    "/:id",
    {
      schema: {
        ...getCooperadoSchema,
        summary: "Busca um cooperado por ID",
        tags: ["Cooperados"],
      },
      preHandler: [app.checkRoles(["SUPER", "ADMIN"])],
    },
    (req, reply) => controller.show(req, reply),
  );

  typedApp.post(
    "/",
    {
      schema: {
        ...createCooperadoSchema,
        summary: "Cria um novo cooperado",
        tags: ["Cooperados"],
      },
      preHandler: [app.checkRoles(["SUPER", "ADMIN"])],
    },
    (req, reply) => controller.store(req, reply),
  );

  typedApp.put(
    "/:id",
    {
      schema: {
        ...updateCooperadoSchema,
        summary: "Atualiza um cooperado",
        tags: ["Cooperados"],
      },
      preHandler: [app.checkRoles(["SUPER", "ADMIN"])],
    },
    (req, reply) => controller.update(req, reply),
  );

  typedApp.delete(
    "/:id",
    {
      schema: {
        ...deleteCooperadoSchema,
        summary: "Exclui um cooperado",
        tags: ["Cooperados"],
      },
      preHandler: [app.checkRoles(["SUPER", "ADMIN"])],
    },
    (req, reply) => controller.delete(req, reply),
  );
}
