import type { FastifyInstance, FastifyError } from "fastify";
import { ZodError } from "zod";
import { AppError } from "./app-error.js";

export const errorHandler: FastifyInstance["errorHandler"] = (
  error,
  request,
  reply,
) => {
  const fastifyError = error as FastifyError;

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
      // Se for um erro de validação customizado, inclui os detalhes dos campos
      ...(error.name === "ValidationError"
        ? { errors: (error as any).errors }
        : {}),
    });
  }

  // Fallback para erros genéricos com statusCode (compatibilidade)
  const statusCode = fastifyError.statusCode || 500;

  if (statusCode < 500) {
    return reply.status(statusCode).send({
      success: false,
      message: fastifyError.message,
    });
  }

  // Erros Críticos/Inesperados (500+)
  request.log.error({ err: error }, fastifyError.message); // Log detalhado apenas para erros internos

  return reply.status(500).send({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Erro interno do servidor."
        : fastifyError.message,
  });
};
