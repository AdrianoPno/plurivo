import { FastifyInstance } from "fastify";
import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import tenantsRoutes from "./modules/tenants/tenants.routes.js";
import healthRoutes from "./health/helth.route.js";

export default async function (app: FastifyInstance) {
  app.register(healthRoutes, { prefix: "/health" });
  // Rotas de Autenticação (ex: /api/auth/me)
  app.register(authRoutes, { prefix: "/auth" });

  // Rotas de Gerenciamento de Usuários (ex: /api/users)
  app.register(usersRoutes, { prefix: "/users" });
  app.register(tenantsRoutes, { prefix: "/tenants" });
}
