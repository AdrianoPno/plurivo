import { z } from "zod";

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

export const ArtifactSchema = z.object({
  url: z.string().url("URL do artefato inválida."),
  name: z.string().min(1).optional(),
  type: z.string().optional(),
});

export const baseResearchSchema = z.object({
  title: z.string().min(3, "Título deve ter ao menos 3 caracteres."),
  description: z.string().min(10, "Descrição deve ter ao menos 10 caracteres."),
  objective: z.string().min(1, "Objetivo é obrigatório."),

  status: ResearchStatusSchema,

  methodology: ResearchMethodologySchema,

  startDate: z.string().datetime("Data de início inválida."),

  estimatedEndDate: z.string().datetime("Data estimada de término inválida."),

  actualEndDate: z
    .string()
    .datetime("Data real de término inválida.")
    .nullable()
    .optional(),

  estimatedCost: z
    .number()
    .nonnegative("O custo estimado não pode ser negativo."),

  actualCost: z.number().nonnegative("O custo real não pode ser negativo."),

  targetAudience: z.string().min(1, "Público-alvo é obrigatório."),

  location: z.string().min(1, "Localização é obrigatória."),

  tags: z.array(z.string()),

  artifacts: z.array(ArtifactSchema),

  insights: z.string().optional(),
});

export const createResearchBodySchema = baseResearchSchema;

export const updateResearchBodySchema = baseResearchSchema.partial();

export const researchResponseSchema = baseResearchSchema.extend({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const listResearchQuerySchema = z.object({
  status: ResearchStatusSchema.optional(),
  tag: z.string().optional(),
  location: z.string().optional(),
  title: z.string().optional(),

  limit: z.coerce.number().int().positive().max(1000).optional(),

  startAfter: z.string().optional(),
});

export const listResearchResponseSchema = z.object({
  data: z.array(researchResponseSchema),
  nextCursor: z.string().optional(),
});

export const researchIdParamsSchema = z.object({
  id: z.string(),
});

export type CreateResearchBody = z.infer<typeof createResearchBodySchema>;

export type UpdateResearchBody = z.infer<typeof updateResearchBodySchema>;

export type ListResearchQuery = z.infer<typeof listResearchQuerySchema>;

export type ResearchResponse = z.infer<typeof researchResponseSchema>;

export type ListResearchResponse = z.infer<typeof listResearchResponseSchema>;

export type ResearchIdParams = z.infer<typeof researchIdParamsSchema>;
