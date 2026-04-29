import { FastifyReply, FastifyRequest } from "fastify";
import { RegisterResearch } from "@/application/use-cases/RegisterResearch";
import { UpdateResearch } from "@/application/use-cases/UpdateResearch";
import { DeleteResearch } from "@/application/use-cases/DeleteResearch";
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

  async create(
    request: FastifyRequest<{ Body: CreateResearchBody }>,
    reply: FastifyReply,
  ) {
    const result = await this.registerResearch.execute(request.body);

    return reply.status(201).send({
      id: result.id,
      title: result.props.title,
      status: result.props.status,
      createdAt: result.props.createdAt?.toISOString(),
    });
  }

  async list(
    request: FastifyRequest<{ Querystring: ListResearchQuery }>,
    reply: FastifyReply,
  ) {
    const result = await this.repository.listAll(request.query);

    const response = result.map((r) => ({
      title: r.props.title,
      status: r.props.status,
      createdAt: r.props.createdAt?.toISOString(),
    }));

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

    return reply.status(200).send({
      id: result.id,
      title: result.props.title,
      status: result.props.status,
      createdAt: result.props.createdAt?.toISOString(),
      updatedAt: result.props.updatedAt?.toISOString(),
    });
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
