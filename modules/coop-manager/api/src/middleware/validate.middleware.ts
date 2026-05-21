import { FastifyReply, FastifyRequest } from "fastify";
import { ZodSchema, ZodError } from "zod";
import logger from "../config/logger";
import { ValidationError } from "../utils/ValidationError.js";

/**
 * Middleware de validação para Fastify usando Zod.
 * Nota: O Fastify com Type Provider Zod já faz isso nativamente via schema,
 * mas este middleware pode ser usado para validações customizadas se necessário.
 */
export const validate =
  (schema: ZodSchema) => async (req: FastifyRequest, _reply: FastifyReply) => {
    logger.debug(
      { method: req.method, url: req.url, params: req.params },
      `[VALIDATE] Recebendo requisição`,
    );

    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          "Dados inválidos.",
          error.flatten().fieldErrors,
        );
      }
      throw error;
    }
  };
