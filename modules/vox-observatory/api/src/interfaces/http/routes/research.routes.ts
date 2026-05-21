import { DeleteResearch } from "@/application/use-cases/DeleteResearch.js";
import { GetResearchById } from "@/application/use-cases/GetResearchById.js";
import { RegisterResearch } from "@/application/use-cases/RegisterResearch.js";
import { UpdateResearch } from "@/application/use-cases/UpdateResearch.js";
import { FirestoreResearchRepository } from "@/infra/database/FirestoreResearchRepository.js";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { ResearchController } from "../controllers/ResearchController.js";
import {
  createResearchBodySchema,
  listResearchResponseSchema,
  listResearchQuerySchema,
  researchIdParamsSchema,
  researchResponseSchema,
  updateResearchBodySchema,
} from "../schemas/research.schema.js";

export async function researchRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  const repository = new FirestoreResearchRepository();
  const registerResearch = new RegisterResearch(repository);
  const updateResearch = new UpdateResearch(repository);
  const deleteResearch = new DeleteResearch(repository);
  const getResearchById = new GetResearchById(repository);

  const controller = new ResearchController(
    repository,
    registerResearch,
    updateResearch,
    deleteResearch,
    getResearchById,
  );

  app.post(
    "/researches",
    {
      schema: {
        description: "Cadastra uma nova descoberta no Vox Lab",
        tags: ["Research"],
        security: [{ bearerAuth: [] }],
        body: createResearchBodySchema,
        response: {
          201: researchResponseSchema,
        },
      },
      preHandler: [app.authenticate],
    },
    controller.create.bind(controller) as any,
  );

  app.get(
    "/researches",
    {
      schema: {
        description: "Lista todas as pesquisas com filtros opcionais",
        tags: ["Research"],
        security: [{ bearerAuth: [] }],
        querystring: listResearchQuerySchema,
        response: {
          200: listResearchResponseSchema,
        },
      },
      preHandler: [app.authenticate],
    },
    controller.list.bind(controller) as any,
  );

  app.get(
    "/researches/:id",
    {
      schema: {
        description: "Busca uma pesquisa específica pelo seu ID",
        tags: ["Research"],
        security: [{ bearerAuth: [] }],
        params: researchIdParamsSchema,
        response: {
          200: researchResponseSchema,
        },
      },
      preHandler: [app.authenticate],
    },
    controller.getById.bind(controller) as any,
  );

  app.patch(
    "/researches/:id",
    {
      schema: {
        description: "Atualiza parcialmente uma pesquisa existente",
        tags: ["Research"],
        security: [{ bearerAuth: [] }],
        params: researchIdParamsSchema,
        body: updateResearchBodySchema,
        response: {
          200: researchResponseSchema,
        },
      },
      preHandler: [app.authenticate],
    },
    controller.update.bind(controller) as any,
  );

  app.delete(
    "/researches/:id",
    {
      schema: {
        description: "Remove uma pesquisa existente",
        tags: ["Research"],
        security: [{ bearerAuth: [] }],
        params: researchIdParamsSchema,
        response: {
          204: z.void(),
        },
      },
      preHandler: [app.authenticate],
    },
    controller.delete.bind(controller) as any,
  );
}
