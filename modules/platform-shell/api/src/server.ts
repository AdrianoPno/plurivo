import "dotenv/config";
import Fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform, // Injetado
} from "fastify-type-provider-zod";
import routes from "./routes.js";
import { authPlugin } from "./plugins/auth.plugin.js";
import { errorHandler } from "@shared/utils/error-handler.js";
import { getAllowedOrigins } from "@shared/config/cors-origins.js";

const app = Fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transport:
      process.env.NODE_ENV !== "production"
        ? {
            target: "pino-pretty",
            options: {
              translateTime: "SYS:HH:MM:ss.l",
              ignore: "hostname",
            },
          }
        : undefined,
  },
});

async function bootstrap() {
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Registrar o Swagger para documentação da API
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Plurivo - Platform Shell API",
        description:
          "API do módulo principal da plataforma, responsável pela orquestração de autenticação e usuários.",
        version: "1.0.0",
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
      tags: [
        { name: "Auth", description: "Endpoints de autenticação" },
        {
          name: "Users",
          description: "Endpoints de gerenciamento de usuários",
        },
        { name: "Tenants", description: "Organizacoes clientes da plataforma" },
      ],
    },
    // CORREÇÃO DO ERRO 500: Ensina o Swagger a ler schemas do Zod
    transform: jsonSchemaTransform,
  });

  // Registrar a UI do Swagger, que ficará disponível em /docs
  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
      persistAuthorization: true,
    },
    staticCSP: true,
    transformStaticCSP: (header: string) => header,
  });

  await app.register(helmet, { contentSecurityPolicy: false });

  await app.register(cors, {
    origin: getAllowedOrigins(),
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  await app.register(authPlugin);

  await app.register(routes, { prefix: "/api" });

  app.setErrorHandler(
    (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
      // O `errorHandler` compartilhado é chamado aqui para centralizar a lógica de tratamento de erros.
      // Este wrapper garante a compatibilidade de tipos com o Fastify.
      errorHandler(error, request, reply);
    },
  );

  const PORT = Number(process.env.PORT || 3000);

  await app.listen({ port: PORT, host: "0.0.0.0" });
}

bootstrap().catch((error) => {
  app.log.error(error);
  process.exit(1);
});
