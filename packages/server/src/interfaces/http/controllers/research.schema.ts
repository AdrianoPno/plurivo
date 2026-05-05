import { z } from "zod";

// Schema para um artefato (arquivo, link, etc.)
export const ArtifactSchema = z.object({
  url: z.string().url("URL do artefato inválida."),
  name: z.string().optional(),
  type: z.string().optional(), // Ex: "image", "document", "link"
});

// Schema para o corpo da requisição de criação de pesquisa
export const createResearchBodySchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),
  description: z
    .string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres."),
  objective: z.string().min(1, "O objetivo é obrigatório."),
  methodology: z.enum([
    "quantitativa",
    "qualitativa",
    "etnografica",
    "teste_usabilidade",
  ]),
  startDate: z
    .string()
    .datetime("Formato de data de início inválido (ISO 8601 esperado)."),
  estimatedEndDate: z
    .string()
    .datetime(
      "Formato de data de término estimado inválido (ISO 8601 esperado).",
    ),
  status: z
    .enum(["em_andamento", "concluida", "pausada"])
    .default("em_andamento"),
  targetAudience: z.string().min(1, "O público-alvo é obrigatório."),
  location: z.string().min(1, "A localização é obrigatória."),
  estimatedCost: z.number().nonnegative("O custo deve ser um valor positivo."),
  tags: z.array(z.string()).min(1, "Adicione pelo menos uma tag."),
  insights: z.string().optional(),
  artifacts: z.array(ArtifactSchema).optional(), // Agora espera um array de objetos Artifact
});

export type CreateResearchBody = z.infer<typeof createResearchBodySchema>;

// Schema para o corpo da requisição de atualização de pesquisa
export const updateResearchBodySchema = z
  .object({
    title: z
      .string()
      .min(3, "O título deve ter pelo menos 3 caracteres.")
      .optional(),
    description: z
      .string()
      .min(10, "A descrição deve ter pelo menos 10 caracteres.")
      .optional(),
    objective: z.string().min(1, "O objetivo é obrigatório.").optional(),
    methodology: z
      .enum(["quantitativa", "qualitativa", "etnografica", "teste_usabilidade"])
      .optional(),
    startDate: z
      .string()
      .datetime("Formato de data de início inválido (ISO 8601 esperado).")
      .optional(),
    estimatedEndDate: z
      .string()
      .datetime(
        "Formato de data de término estimado inválido (ISO 8601 esperado).",
      )
      .optional(),
    actualEndDate: z
      .string()
      .datetime("Formato de data de término real inválido (ISO 8601 esperado).")
      .nullable()
      .optional(),
    status: z.enum(["em_andamento", "concluida", "pausada"]).optional(),
    targetAudience: z
      .string()
      .min(1, "O público-alvo é obrigatório.")
      .optional(),
    location: z.string().min(1, "A localização é obrigatória.").optional(),
    estimatedCost: z
      .number()
      .nonnegative("O custo deve ser um valor positivo.")
      .optional(),
    actualCost: z
      .number()
      .nonnegative("O custo real deve ser um valor positivo.")
      .optional(),
    tags: z.array(z.string()).min(1, "Adicione pelo menos uma tag.").optional(),
    insights: z.string().optional(),
    artifacts: z.array(ArtifactSchema).optional(), // Agora espera um array de objetos Artifact
  })
  .partial(); // Permite que todos os campos sejam opcionais para PATCH

export type UpdateResearchBody = z.infer<typeof updateResearchBodySchema>;

// Schema para parâmetros de ID de pesquisa
export const researchIdParamsSchema = z.object({
  id: z.string().min(1, "ID da pesquisa é obrigatório."),
});

// Schema para a resposta da API de pesquisa (completa)
export const researchResponseSchema = createResearchBodySchema.extend({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  actualEndDate: z.string().datetime().nullable().optional(),
  actualCost: z
    .number()
    .nonnegative("O custo real deve ser um valor positivo.")
    .optional(),
});

export type ResearchResponse = z.infer<typeof researchResponseSchema>;

// Schema para query de listagem de pesquisas
export const listResearchQuerySchema = z
  .object({
    status: z.enum(["em_andamento", "concluida", "pausada"]).optional(),
    tag: z.string().optional(),
    location: z.string().optional(),
    title: z.string().optional(),
  })
  .partial();

export type ListResearchQuery = z.infer<typeof listResearchQuerySchema>;
