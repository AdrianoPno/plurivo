import { FastifyInstance } from "fastify";
import authRoutes from "./modules/auth/auth.routes.js";
import cargosRoutes from "./modules/cargos/cargos.routes.js";
import cooperadosRoutes from "./modules/cooperados/cooperados.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import unidadesRoutes from "./modules/unidades/unidades.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import healthRoutes from "./health.routes.js";

export default async function routes(app: FastifyInstance<any, any, any, any>) {
  await app.register(authRoutes, { prefix: "/auth" });
  await app.register(cargosRoutes, { prefix: "/cargos" });
  await app.register(cooperadosRoutes, { prefix: "/cooperados" });
  await app.register(usersRoutes, { prefix: "/users" });
  await app.register(unidadesRoutes, { prefix: "/unidades" });
  await app.register(dashboardRoutes, { prefix: "/dashboard" });
  await app.register(healthRoutes, { prefix: "/health" });
}
