import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { MODULE_URLS } from "@shared/constants/modules.js";
import { errorHandler } from "@shared/utils/error-handler.js";

import { setupSwagger } from "./config/swagger.js";
import logger from "./config/logger.js";
import { authPlugin } from "./plugins/auth.plugin.js";
import routes from "./routes.js";

const app = Fastify({ logger });

async function bootstrap() {
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(helmet, { contentSecurityPolicy: false });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: "15m",
  });

  await app.register(cors, {
    origin: [
      MODULE_URLS.platformShell.web,
      MODULE_URLS.voxObservatory.web,
      MODULE_URLS.coopManager.web,
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  await app.register(authPlugin);
  await setupSwagger(app);
  await app.register(routes, { prefix: "/api" });

  app.setErrorHandler(errorHandler as any);

  const PORT = Number(process.env.PORT || 3004);

  await app.listen({ port: PORT, host: "0.0.0.0" });
}

bootstrap().catch((error) => {
  logger.error(error);
  process.exit(1);
});
