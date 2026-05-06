import { FastifyReply, FastifyRequest } from "fastify";
import { RegisterResearch } from "@/application/use-cases/RegisterResearch";
import { UpdateResearch } from "@/application/use-cases/UpdateResearch";
import { DeleteResearch } from "@/application/use-cases/DeleteResearch";
import { GetResearchById } from "@/application/use-cases/GetResearchById";
import { Research } from "@/domain/entities/Research";
import { ResearchRepository } from "@/domain/repositories/ResearchRepository";
import {
  UpdateResearchBody,
  CreateResearchBody,
  ListResearchQuery,
} from "@/interfaces/http/schemas/research.schema";

export class ResearchController {
  constructor(
    private repository: ResearchRepository,
    private registerResearch: RegisterResearch,
    private updateResearch: UpdateResearch,
    private deleteResearch: DeleteResearch,
    private getResearchById: GetResearchById,
  ) {}

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
      actualCost: props.actualCost,
      tags: props.tags,
      insights: props.insights,
      artifacts: props.artifacts || [],

      // Garante que todas as datas sejam strings no formato ISO 8601
      createdAt: props.createdAt?.toISOString() ?? null,
      updatedAt: props.updatedAt?.toISOString() ?? null,
      startDate: props.startDate.toISOString(),
      estimatedEndDate: props.estimatedEndDate.toISOString(),
      actualEndDate: props.actualEndDate
        ? props.actualEndDate.toISOString()
        : null,
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
    const responseData = researches.map((r) => this.toResponse(r));
    return reply.send({ data: responseData, nextCursor });
  }

  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    const research = await this.getResearchById.execute(id);

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
