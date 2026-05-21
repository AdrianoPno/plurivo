import { z } from "zod";

const UnidadeStatus = z.enum(["ATIVO", "INATIVO"]);

const params = z.object({
  id: z.string({ required_error: "O ID da unidade é obrigatório." }),
});

export const createUnidadeSchema = {
  body: z.object({
    nome: z.string().min(1, "O nome é obrigatório."),
    sigla: z.string().min(1, "A sigla é obrigatória."),
    status: UnidadeStatus.optional(),
  }),
};

export const updateUnidadeSchema = {
  params,
  body: z
    .object({
      nome: z.string().min(1),
      sigla: z.string().min(1),
      status: UnidadeStatus,
    })
    .partial(),
};

export const getUnidadeSchema = {
  params,
};

export const deleteUnidadeSchema = {
  params,
};
