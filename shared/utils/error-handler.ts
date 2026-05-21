import type { FastifyRequest, FastifyReply, FastifyError } from "fastify";
import { ZodError } from "zod";
import { AppError } from "./app-error.js";

/**
 * Global Error Handler padronizado e compatível com as instâncias Fastify do monorepo.
 */
export const errorHandler = (
  error: FastifyError | Error,
  request: FastifyRequest<any, any, any, any, any, any, any>,
  reply: FastifyReply<any, any, any, any, any>,
) => {
  // Erros de Validação do Zod
  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      message: "Erro de validação dos dados.",
      errors: error.flatten().fieldErrors,
    });
  }

  // Erros de Negócio (AppError)
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      message: error.message,
      ...(error.name === "ValidationError"
        ? { errors: (error as any).errors }
        : {}),
    });
  }

  const fastifyError = error as FastifyError;
  const statusCode = fastifyError.statusCode || 500;

  if (statusCode < 500) {
    return reply.status(statusCode).send({
      success: false,
      message: fastifyError.message,
    });
  }

  // Erros Críticos/Inesperados (500+)
  request.log.error({ err: error }, fastifyError.message);

  return reply.status(500).send({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Erro interno do servidor."
        : fastifyError.message,
  });
};
