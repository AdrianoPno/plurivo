import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateTenantInput, UpdateTenantInput } from "@shared/types/tenant.js";
import type {
  CreateTenantUseCase,
  GetTenantUseCase,
  ListTenantsUseCase,
  UpdateTenantUseCase,
} from "./tenant.use-cases.js";

export class TenantsController {
  constructor(
    private readonly listTenants: ListTenantsUseCase,
    private readonly getTenant: GetTenantUseCase,
    private readonly createTenant: CreateTenantUseCase,
    private readonly updateTenant: UpdateTenantUseCase,
  ) {}

  async index(_request: FastifyRequest, reply: FastifyReply) {
    return reply.send({ success: true, data: await this.listTenants.execute() });
  }

  async show(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    return reply.send({ success: true, data: await this.getTenant.execute(request.params.id) });
  }

  async store(request: FastifyRequest<{ Body: CreateTenantInput }>, reply: FastifyReply) {
    const tenant = await this.createTenant.execute(request.body);
    return reply.status(201).send({ success: true, data: tenant });
  }

  async update(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateTenantInput }>,
    reply: FastifyReply,
  ) {
    const tenant = await this.updateTenant.execute(request.params.id, request.body);
    return reply.send({ success: true, data: tenant });
  }
}
