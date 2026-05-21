import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { UnidadesController } from "./unidades.controller.js";
import {
  getUnidadeSchema,
  createUnidadeSchema,
  updateUnidadeSchema,
  deleteUnidadeSchema,
} from "../../utils/unidades.schema.js";
import { FirestoreUnidadeRepository } from "./infra/persistence/firestore-unidade.repository.js";
import { ListUnidadesUseCase } from "./application/use-cases/list-unidades.use-case.js";
import { CreateUnidadeUseCase } from "./application/use-cases/create-unidade.use-case.js";
import { GetUnidadeUseCase } from "./application/use-cases/get-unidade.use-case.js";
import { UpdateUnidadeUseCase } from "./application/use-cases/update-unidade.use-case.js";
import { DeleteUnidadeUseCase } from "./application/use-cases/delete-unidade.use-case.js";
// Importe os outros Casos de Uso de Unidades aqui quando criá-los

export default async function unidadesRoutes(
  app: FastifyInstance<any, any, any, any>,
) {
  const repository = new FirestoreUnidadeRepository();

  const controller = new UnidadesController(
    new ListUnidadesUseCase(repository),
    new GetUnidadeUseCase(repository),
    new CreateUnidadeUseCase(repository),
    new UpdateUnidadeUseCase(repository),
    new DeleteUnidadeUseCase(repository),
  );

  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.addHook("preHandler", app.authenticate);

  typedApp.get(
    "/",
    {
      schema: {
        summary: "Lista todas as unidades",
        tags: ["Unidades"],
      },
      preHandler: [app.checkRoles(["SUPER", "ADMIN"])],
    },
    (req, reply) => controller.index(req, reply),
  );

  typedApp.get(
    "/:id",
    {
      schema: {
        ...getUnidadeSchema,
        summary: "Detalha uma unidade",
        tags: ["Unidades"],
      },
      preHandler: [app.checkRoles(["SUPER", "ADMIN"])],
    },
    (req, reply) => controller.show(req, reply),
  );

  typedApp.post(
    "/",
    {
      schema: {
        ...createUnidadeSchema,
        summary: "Cria uma nova unidade",
        tags: ["Unidades"],
      },
      preHandler: [app.checkRoles(["SUPER"])],
    },
    (req, reply) => controller.store(req, reply),
  );

  // ... Repetir o padrão para PATCH e DELETE
}
