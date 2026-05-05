import { z } from "zod";

// Schema para a criação (Body)
export const createResearchBodySchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  objective: z.string(),
  status: z
    .enum(["em_andamento", "concluida", "pausada"])
    .default("em_andamento"),
  methodology: z.enum([
    "quantitativa",
    "qualitativa",
    "etnografica",
    "teste_usabilidade",
  ]),
  startDate: z.string().datetime(),
  estimatedEndDate: z.string().datetime(),
  actualEndDate: z.string().datetime().optional().nullable(),
  estimatedCost: z.number().nonnegative(),
  actualCost: z.number().default(0),
  targetAudience: z.string(),
  location: z.string(),
  tags: z.array(z.string()),
  artifacts: z.array(z.string()).default([]),
  insights: z.string().optional(),
});

// Schema para a resposta (Response)
export const researchResponseSchema = createResearchBodySchema.extend({
  id: z.string(),
  // Garante que os campos de data gerados pelo servidor existam na resposta
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Inferência de tipos para usar no Controller (Senior Practice)
export type CreateResearchBody = z.infer<typeof createResearchBodySchema>;

export const listResearchQuerySchema = z.object({
  status: z.enum(["em_andamento", "concluida", "pausada"]).optional(),
  tag: z.string().optional(),
  location: z.string().optional(),
  title: z.string().optional(),
});

export type ListResearchQuery = z.infer<typeof listResearchQuerySchema>;

// Schema para atualização parcial (Body)
export const updateResearchBodySchema = createResearchBodySchema.partial();

export type UpdateResearchBody = z.infer<typeof updateResearchBodySchema>;

// Schema para validação de ID em parâmetros de rota
export const researchIdParamsSchema = z.object({ id: z.string() });
