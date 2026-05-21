import { z } from "zod";

const params = z.object({
  id: z
    .string({ required_error: "O ID do cooperado é obrigatório." })
    .min(1, "O ID não pode estar vazio"),
});

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "A data deve estar no formato YYYY-MM-DD.");

const cooperadoBodyBase = z.object({
  ID_COOPERADO: z.string().min(1, "A matrícula é obrigatória."),
  nome: z.string().min(1, "O nome é obrigatório."),
  email: z.string().email("E-mail inválido.").optional().or(z.literal("")),
  cpf: z.string().min(1, "O CPF é obrigatório."),
  dataNascimento: dateSchema.optional().or(z.literal("")),
  etnia: z.string().optional(),
  escolaridade: z.string().optional(),
  cargo: z.string().min(1, "O cargo é obrigatório."),
  tipoVinculo: z.enum(["COOP", "RPA"]).optional(),
  dataEntrada: dateSchema.optional().or(z.literal("")),
  dataSaida: dateSchema.nullable().optional(),
  status: z.enum(["ATIVO", "INATIVO", "PENDENTE"]),
});

export const createCooperadoSchema = z.object({
  body: cooperadoBodyBase,
});

export const updateCooperadoSchema = z.object({
  params,
  body: cooperadoBodyBase
    .partial()
    .refine(
      (data) => Object.keys(data).length > 0,
      "Pelo menos um campo deve ser fornecido para atualização.",
    ),
});

export const getCooperadoSchema = z.object({
  params,
  body: z.any().optional(),
  query: z.any().optional(),
});

export const deleteCooperadoSchema = z.object({
  params,
});
