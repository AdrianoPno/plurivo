import { DeleteResearch } from "@/application/use-cases/DeleteResearch.js";
import { GetResearchById } from "@/application/use-cases/GetResearchById.js";
import { RegisterResearch } from "@/application/use-cases/RegisterResearch.js";
import { UpdateResearch } from "@/application/use-cases/UpdateResearch.js";
import { Research } from "@/domain/entities/Research.js";
import { ResearchRepository } from "@/domain/repositories/ResearchRepository.js";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateResearchBody,
  ListResearchQuery,
  UpdateResearchBody,
} from "../schemas/research.schema.js";

export class ResearchController {
  constructor(
    private repository: ResearchRepository,
    private registerResearch: RegisterResearch,
    private updateResearch: UpdateResearch,
    private deleteResearch: DeleteResearch,
    private getResearchById: GetResearchById,
  ) {}

  private toISOStringOrNull(date?: Date | null) {
    if (!date) return null;

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate.toISOString();
  }

  private toResponse(research: Research) {
    const { props, id } = research;

    return {
      id,
      title: props.title,
      description: props.description,
      objective: props.objective,
      methodology: props.methodology,
      status: props.status,
      targetAudience: props.targetAudience,
      location: props.location,
      estimatedCost: props.estimatedCost,
      actualCost: props.actualCost ?? 0,
      tags: props.tags ?? [],
      insights: props.insights ?? undefined,
      artifacts: props.artifacts ?? [],

      createdAt: this.toISOStringOrNull(props.createdAt),
      updatedAt: this.toISOStringOrNull(props.updatedAt),
      startDate: this.toISOStringOrNull(props.startDate),
      estimatedEndDate: this.toISOStringOrNull(props.estimatedEndDate),
      actualEndDate: this.toISOStringOrNull(props.actualEndDate),
    };
  }

  async create(
    request: FastifyRequest<{ Body: CreateResearchBody }>,
    reply: FastifyReply,
  ) {
    const result = await this.registerResearch.execute(request.body);

    return reply.status(201).send(this.toResponse(result));
  }

  async list(
    request: FastifyRequest<{ Querystring: ListResearchQuery }>,
    reply: FastifyReply,
  ) {
    const { researches, nextCursor } = await this.repository.listAll(
      request.query,
    );

    const responseData = researches.map((research) =>
      this.toResponse(research),
    );

    return reply.send({
      data: responseData,
      nextCursor,
    });
  }

  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    const research = await this.getResearchById.execute(id);

    // O schema de resposta para esta rota parece esperar um objeto com a propriedade 'data',
    // que deve ser um array. Para resolver o erro de validação, a resposta é encapsulada
    // na estrutura { data: [...] }, embora o ideal fosse corrigir o schema da rota.
    return reply.send(this.toResponse(research));
  }

  async update(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateResearchBody;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    const result = await this.updateResearch.execute(id, request.body);

    return reply.status(200).send(this.toResponse(result));
  }

  async delete(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;

    await this.deleteResearch.execute(id);

    return reply.status(204).send();
  }
}
