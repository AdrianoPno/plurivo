import { FastifyReply, FastifyRequest } from "fastify";
import { RegisterResearch } from "@/application/use-cases/RegisterResearch";
import { UpdateResearch } from "@/application/use-cases/UpdateResearch";
import { DeleteResearch } from "@/application/use-cases/DeleteResearch";
import { Research } from "@/domain/entities/Research";
import { ResearchRepository } from "@/domain/repositories/ResearchRepository";
import {
  UpdateResearchBody,
  CreateResearchBody,
  ListResearchQuery,
} from "../schemas/research.schema";

export class ResearchController {
  constructor(
    private repository: ResearchRepository,
    private registerResearch: RegisterResearch,
    private updateResearch: UpdateResearch,
    private deleteResearch: DeleteResearch,
  ) {}

  private toResponse(research: Research) {
    return {
      id: research.id,
      ...research.props,
      // Garante que as datas sejam strings no formato ISO
      createdAt: research.props.createdAt?.toISOString(),
      updatedAt: research.props.updatedAt?.toISOString(),
      startDate: research.props.startDate?.toISOString(),
      estimatedEndDate: research.props.estimatedEndDate?.toISOString(),
      actualEndDate: research.props.actualEndDate
        ? research.props.actualEndDate.toISOString()
        : null,
      artifacts: research.props.artifacts || [], // Garante que seja um array, mesmo que vazio
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
    const researches = await this.repository.listAll(request.query);
    const response = researches.map((r) => this.toResponse(r));
    return reply.send(response);
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
