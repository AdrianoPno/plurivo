import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "@shared/utils/app-error.js";
import { ValidationError } from "../utils/ValidationError";

export const errorMiddleware = (
  error: FastifyError,
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  if (error instanceof ValidationError) {
    return reply.status(error.statusCode).send({
      success: false,
      message: error.message,
      errors: error.errors,
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      message: error.message,
    });
  }

  req.log.error({ err: error }, `[ERROR] ${req.method} ${req.url}`);

  return reply.status(500).send({
    success: false,
    message: "Erro interno do servidor.",
  });
};
