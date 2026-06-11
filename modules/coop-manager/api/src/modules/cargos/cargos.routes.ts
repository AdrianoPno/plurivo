import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { CargosController } from "./cargos.controller.js";
import {
  createCargoSchema,
  deleteCargoSchema,
  listCargosSchema,
  updateCargoSchema,
} from "../../utils/cargos.schema.js";

export default async function cargosRoutes(
  app: FastifyInstance<any, any, any, any>,
) {
  const controller = new CargosController();
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.addHook("preHandler", app.authenticate);

  typedApp.get(
    "/",
    {
      schema: {
        ...listCargosSchema,
        summary: "Lista cargos e vagas disponiveis",
        tags: ["Cargos"],
      },
      preHandler: [app.checkRoles(["SUPER", "ADMIN", "USER", "VIEWER"])],
    },
    (req, reply) => controller.index(req, reply),
  );

  typedApp.post(
    "/",
    {
      schema: {
        ...createCargoSchema,
        summary: "Cria um novo cargo",
        tags: ["Cargos"],
      },
      preHandler: [app.checkRoles(["SUPER"])],
    },
    (req, reply) => controller.store(req, reply),
  );

  typedApp.put(
    "/:id",
    {
      schema: {
        ...updateCargoSchema,
        summary: "Atualiza um cargo",
        tags: ["Cargos"],
      },
      preHandler: [app.checkRoles(["SUPER"])],
    },
    (req, reply) => controller.update(req, reply),
  );

  typedApp.delete(
    "/:id",
    {
      schema: {
        ...deleteCargoSchema,
        summary: "Exclui um cargo",
        tags: ["Cargos"],
      },
      preHandler: [app.checkRoles(["SUPER"])],
    },
    (req, reply) => controller.delete(req, reply),
  );
}
