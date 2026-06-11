import { z } from "zod";

const params = z.object({
  id: z.string().min(1, "ID e obrigatorio."),
});

const cargoBodyBase = z.object({
  nome: z.string().min(1, "Nome do cargo e obrigatorio."),
  limiteVagas: z.coerce.number().int().min(1, "O limite deve ser maior que zero."),
  ativo: z.boolean().optional(),
});

export const listCargosSchema = {
  querystring: z.object({
    unidadeId: z.string().optional(),
  }),
};

export const createCargoSchema = {
  body: cargoBodyBase,
};

export const updateCargoSchema = {
  params,
  body: cargoBodyBase.partial(),
};

export const deleteCargoSchema = {
  params,
};
