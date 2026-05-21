import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import routes from "./routes.js";
import { authPlugin } from "./plugins/auth.plugin.js";
import { setupSwagger } from "./config/swagger.js";
import { errorHandler } from "@shared/utils/error-handler.js";
import logger from "./config/logger.js";

const app = Fastify({ logger });

async function bootstrap() {
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(helmet, { contentSecurityPolicy: false });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: "15m",
  });

  // CORS atualizado refletindo a padronização sequencial dos Frontends
  await app.register(cors, {
    origin: [
      "http://localhost:3001", // Platform Shell Web
      "http://localhost:3003", // Vox Observatory Web
      "http://localhost:3005", // Coop Manager Web (Ímpar correspondente)
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  await app.register(authPlugin);

  await setupSwagger(app);

  await app.register(routes, { prefix: "/api" });

  app.setErrorHandler(errorHandler as any);

  // Alterado de 3002 para 3004 seguindo a sequência lógica (API do Coop)
  const PORT = Number(process.env.PORT || 3004);

  await app.listen({ port: PORT, host: "0.0.0.0" });
}

bootstrap().catch((error) => {
  logger.error(error);
  process.exit(1);
});
