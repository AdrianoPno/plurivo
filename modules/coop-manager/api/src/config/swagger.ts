import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export const setupSwagger = async (
  app: FastifyInstance<any, any, any, any, any>,
) => {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Coop-Manager API",
        version: "1.0.0",
        description: "API para gerenciamento de cooperados e usuários.",
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
    transform: (data) => {
      try {
        return jsonSchemaTransform(data);
      } catch (error) {
        console.error(
          `[SWAGGER ERROR] Falha ao transformar a rota: ${data.route.method} ${data.route.url}`,
        );
        console.error(error);
        // Retorna o dado sem transformação como fallback para evitar que o Swagger trave por completo
        return data;
      }
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
  });
};
