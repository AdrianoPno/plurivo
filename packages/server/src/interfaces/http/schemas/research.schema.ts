import { z } from "zod";

/**
 * Enums reutilizáveis
 */
export const ResearchStatusSchema = z.enum([
  "em_andamento",
  "concluida",
  "pausada",
]);

export const ResearchMethodologySchema = z.enum([
  "quantitativa",
  "qualitativa",
  "etnografica",
  "teste_usabilidade",
]);

/**
 * Schema de artefato
 */
export const ArtifactSchema = z.object({
  url: z.string().url("URL do artefato inválida."),
  name: z.string().min(1).optional(),
  type: z.string().optional(),
});

/**
 * Schema base reutilizável
 */
const baseResearchSchema = z.object({
  title: z.string().min(3, "Título deve ter ao menos 3 caracteres."),
  description: z.string().min(10, "Descrição deve ter ao menos 10 caracteres."),
  objective: z.string().min(1, "Objetivo é obrigatório."),

  status: ResearchStatusSchema.default("em_andamento"),

  methodology: ResearchMethodologySchema,

  startDate: z.string().datetime(),

  estimatedEndDate: z.string().datetime(),

  actualEndDate: z.string().datetime().nullable().optional(),

  estimatedCost: z
    .number()
    .nonnegative("O custo estimado não pode ser negativo."),

  actualCost: z.number().nonnegative().default(0),

  targetAudience: z.string().min(1),

  location: z.string().min(1),

  tags: z.array(z.string()),

  artifacts: z.array(ArtifactSchema).default([]),

  insights: z.string().optional(),
});

/**
 * CREATE
 */
export const createResearchBodySchema = baseResearchSchema;

/**
 * UPDATE
 */
export const updateResearchBodySchema = baseResearchSchema.partial();

/**
 * RESPONSE
 */
export const researchResponseSchema = baseResearchSchema.extend({
  id: z.string(),

  createdAt: z.string().datetime(),

  updatedAt: z.string().datetime(),
});

/**
 * LIST QUERY
 */
export const listResearchQuerySchema = z.object({
  status: ResearchStatusSchema.optional(),

  tag: z.string().optional(),

  location: z.string().optional(),

  title: z.string().optional(),

  /**
   * Paginação
   */
  limit: z.coerce.number().int().positive().max(50).optional(),

  startAfter: z.string().optional(),
});

/**
 * LIST RESPONSE
 */
export const listResearchResponseSchema = z.object({
  data: z.array(researchResponseSchema),

  nextCursor: z.string().optional(),
});

/**
 * PARAMS
 */
export const researchIdParamsSchema = z.object({
  id: z.string(),
});

/**
 * TYPES
 */
export type CreateResearchBody = z.infer<typeof createResearchBodySchema>;

export type UpdateResearchBody = z.infer<typeof updateResearchBodySchema>;

export type ListResearchQuery = z.infer<typeof listResearchQuerySchema>;

export type ResearchResponse = z.infer<typeof researchResponseSchema>;

export type ListResearchResponse = z.infer<typeof listResearchResponseSchema>;

export type ResearchIdParams = z.infer<typeof researchIdParamsSchema>;
