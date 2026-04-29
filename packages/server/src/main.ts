import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import jwt from "@fastify/jwt";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import {
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { researchRoutes } from "./interfaces/http/routes/research.routes";
import { authRoutes } from "./interfaces/http/routes/auth.routes";
import { userRoutes } from "./interfaces/http/routes/user.routes";
import { storageRoutes } from "./interfaces/http/routes/storage.routes";
import { DocumentNotFoundException } from "./infra/database/firestore";

if (!process.env.JWT_SECRET) {
  throw new Error("A variável de ambiente JWT_SECRET não foi definida.");
}

const fastify = Fastify({ logger: true });

// 1. Configuração dos Compiladores do Zod
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

// 2. Plugins de Infraestrutura
fastify.register(cors);
fastify.register(jwt, {
  secret: process.env.JWT_SECRET,
});

// Adiciona um decorator para autenticação para ser usado como hook
fastify.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  },
);

// 3. Configuração do Swagger (Core)
fastify.register(swagger, {
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

// 4. Configuração da Interface do Swagger
fastify.register(swaggerUi, {
  routePrefix: "/docs",
  staticCSP: true,
  uiConfig: {
    docExpansion: "list",
    deepLinking: false,
  },
});

// 5. Módulos de Negócio
fastify.register(researchRoutes);
fastify.register(authRoutes);
fastify.register(userRoutes);
fastify.register(storageRoutes);

// Global Error Handler
fastify.setErrorHandler(function (error, request, reply) {
  if (error instanceof DocumentNotFoundException) {
    reply.status(404).send({
      statusCode: 404,
      error: "Not Found",
      message: error.message,
    });
    return;
  }
  reply.send(error);
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3333;
    await fastify.listen({ port, host: "0.0.0.0" });

    fastify.log.info(` API: http://localhost:${port}`);
    fastify.log.info(` Docs: http://localhost:${port}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
