import type { FastifyInstance, FastifyRequest } from "fastify";
import type { CreateTenantInput, UpdateTenantInput } from "@shared/types/tenant.js";
import { FirestoreTenantRepository } from "./firestore-tenant.repository.js";
import {
  CreateTenantUseCase,
  GetTenantUseCase,
  ListTenantsUseCase,
  UpdateTenantUseCase,
} from "./tenant.use-cases.js";
import { tenantBodySchema, tenantParamsSchema, updateTenantBodySchema } from "./tenant.schemas.js";
import { TenantsController } from "./tenants.controller.js";

export default async function tenantsRoutes(app: FastifyInstance) {
  const repository = new FirestoreTenantRepository();
  const controller = new TenantsController(
    new ListTenantsUseCase(repository),
    new GetTenantUseCase(repository),
    new CreateTenantUseCase(repository),
    new UpdateTenantUseCase(repository),
  );

  app.addHook("preHandler", app.authenticate);
  app.addHook("preHandler", app.checkRoles(["SUPER"]));

  app.get("/", { schema: { tags: ["Tenants"], security: [{ bearerAuth: [] }] } }, (request, reply) =>
    controller.index(request, reply),
  );
  app.get("/:id", { schema: { tags: ["Tenants"], params: tenantParamsSchema, security: [{ bearerAuth: [] }] } }, (request, reply) =>
    controller.show(request as FastifyRequest<{ Params: { id: string } }>, reply),
  );
  app.post("/", { schema: { tags: ["Tenants"], body: tenantBodySchema, security: [{ bearerAuth: [] }] } }, (request, reply) =>
    controller.store(request as FastifyRequest<{ Body: CreateTenantInput }>, reply),
  );
  app.patch("/:id", { schema: { tags: ["Tenants"], params: tenantParamsSchema, body: updateTenantBodySchema, security: [{ bearerAuth: [] }] } }, (request, reply) =>
    controller.update(request as FastifyRequest<{ Params: { id: string }; Body: UpdateTenantInput }>, reply),
  );
}
