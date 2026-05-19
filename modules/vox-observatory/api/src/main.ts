import Fastify from "fastify";

import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { authenticatePlugin } from "./interfaces/http/plugins/authenticate.js";

import { researchRoutes } from "./interfaces/http/routes/research.routes.js";
import { authRoutes } from "./interfaces/http/routes/auth.routes.js";
import { userRoutes } from "./interfaces/http/routes/user.routes.js";
import { storageRoutes } from "./interfaces/http/routes/storage.routes.js";
import jwt from "@fastify/jwt";

async function bootstrap() {
  const app = Fastify({
    logger: true,
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "dev-secret",
  });
  await app.register(cors, {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: "Vox Observatory API",
        version: "1.0.0",
        description: "Documentação técnica do laboratório Vox Lab",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
  });

  await app.register(authenticatePlugin);

  await app.register(authRoutes, {
    prefix: "/auth",
  });

  await app.register(userRoutes);
  await app.register(researchRoutes);
  await app.register(storageRoutes);

  const PORT = Number(process.env.PORT ?? 3333);

  await app.listen({
    port: PORT,
    host: "0.0.0.0",
  });

  console.log(`🚀 Vox Observatory API running on port ${PORT}`);
}

bootstrap().catch((err) => {
  console.error("Falha ao iniciar a aplicação:", err);
  process.exit(1);
});
