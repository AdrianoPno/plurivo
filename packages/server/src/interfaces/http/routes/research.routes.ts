import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { ResearchController } from "../controllers/ResearchController";
import {
  createResearchBodySchema,
  listResearchQuerySchema,
  researchIdParamsSchema,
  researchResponseSchema,
  updateResearchBodySchema,
} from "../schemas/research.schema";
import { FirestoreResearchRepository } from "@/infra/database/FirestoreResearchRepository";
import { RegisterResearch } from "@/application/use-cases/RegisterResearch";
import { UpdateResearch } from "@/application/use-cases/UpdateResearch";
import { DeleteResearch } from "@/application/use-cases/DeleteResearch";

export async function researchRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  // Injeção de Dependências
  const repository = new FirestoreResearchRepository();
  const registerResearch = new RegisterResearch(repository);
  const updateResearch = new UpdateResearch(repository);
  const deleteResearch = new DeleteResearch(repository);
  const controller = new ResearchController(
    repository,
    registerResearch,
    updateResearch,
    deleteResearch,
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
    controller.create.bind(controller),
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
          200: z.array(researchResponseSchema),
        },
      },
      preHandler: [app.authenticate],
    },
    controller.list.bind(controller),
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
          200: researchResponseSchema, // Assuming the response schema is sufficient for update
        },
      },
      preHandler: [app.authenticate],
    },
    controller.update.bind(controller),
  );

  app.delete(
    "/researches/:id",
    {
      schema: {
        description: "Remove uma pesquisa existente",
        tags: ["Research"],
        security: [{ bearerAuth: [] }],
        params: researchIdParamsSchema,
        response: { 204: z.void() }, // No content on successful delete
      },
      preHandler: [app.authenticate],
    },
    controller.delete.bind(controller),
  );
}
