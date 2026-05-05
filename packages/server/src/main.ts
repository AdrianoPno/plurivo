import Fastify, { FastifyReply, FastifyRequest, FastifyError } from "fastify";
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

import {
  DocumentNotFoundException,
  initializeFirebaseAdmin,
} from "./infra/database/firestore";

import { ValidationException } from "./application/errors/ValidationException";

type ValidationIssue = {
  path?: string[];
  instancePath?: string;
  message?: string;
};

if (!process.env.JWT_SECRET) {
  throw new Error("A variável de ambiente JWT_SECRET não foi definida.");
}

initializeFirebaseAdmin();

const fastify = Fastify({ logger: true });

// ==========================
// ZOD CONFIG
// ==========================
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

// ==========================
// PLUGINS
// ==========================
fastify.register(cors);

fastify.register(jwt, {
  secret: process.env.JWT_SECRET,
});

// ==========================
// AUTH DECORATOR
// ==========================
fastify.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Token inválido ou ausente",
      });
    }
  },
);

// ==========================
// SWAGGER
// ==========================
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

fastify.register(swaggerUi, {
  routePrefix: "/docs",
  staticCSP: true,
  uiConfig: {
    docExpansion: "list",
    deepLinking: false,
  },
});

// ==========================
// ROUTES
// ==========================
fastify.register(researchRoutes);
fastify.register(authRoutes, { prefix: "/auth" });
fastify.register(userRoutes);
fastify.register(storageRoutes);

// ==========================
// GLOBAL ERROR HANDLER
// ==========================
fastify.setErrorHandler((error, request, reply) => {
  // 🔹 VALIDAÇÃO
  if (error.code === "FST_ERR_VALIDATION") {
    const validation = (
      error as FastifyError & {
        validation?: unknown;
      }
    ).validation;

    // 🔹 narrowing seguro
    const issues: ValidationIssue[] = Array.isArray(validation)
      ? (validation as ValidationIssue[])
      : [];

    fastify.log.warn(error);

    return reply.status(400).send({
      statusCode: 400,
      error: "Bad Request",
      message: "Um ou mais campos enviados são inválidos.",
      details: issues.map((e) => ({
        path: e.path?.join(".") || e.instancePath?.replace("/", "") || "",
        message: e.message,
      })),
    });
  }

  // 🔹 NOT FOUND
  if (error instanceof DocumentNotFoundException) {
    return reply.status(404).send({
      statusCode: 404,
      error: "Not Found",
      message: error.message,
    });
  }

  // 🔹 REGRA DE NEGÓCIO
  if (error instanceof ValidationException) {
    return reply.status(400).send({
      statusCode: 400,
      error: "Bad Request",
      message: error.message,
    });
  }

  // 🔹 ERRO DE ÍNDICE DO FIRESTORE (gRPC status code 9)
  // Este é um erro de configuração que precisa ser resolvido no console do Firebase.
  if (
    Number(error.code) === 9 &&
    error.message?.includes("requires an index")
  ) {
    fastify.log.error(
      error,
      "ERRO: Índice composto do Firestore ausente. Crie o índice usando o link no erro.",
    );
    return reply.status(503).send({
      statusCode: 503,
      error: "Service Unavailable",
      message:
        "Ocorreu um erro de configuração no banco de dados. Um índice necessário não foi encontrado.",
      // A propriedade `details` do erro do gRPC contém o link para criar o índice
      details: (error as { details?: string }).details,
    });
  }

  // 🔹 FALLBACK
  fastify.log.error(error);

  return reply.status(500).send({
    statusCode: 500,
    error: "Internal Server Error",
    message: "Erro interno do servidor",
  });
});

// ==========================
// START SERVER
// ==========================
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3333;

    await fastify.listen({
      port,
      host: "0.0.0.0",
    });

    fastify.log.info(`API: http://localhost:${port}`);
    fastify.log.info(`Docs: http://localhost:${port}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
