import { z } from "zod";

const params = z.object({
  id: z.string().min(1, "ID é obrigatório"),
});

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato YYYY-MM-DD");

const cooperadoBodyBase = z.object({
  ID_COOPERADO: z.string().min(1, "Matrícula é obrigatória."),
  nome: z.string().min(1, "Nome é obrigatório."),
  cpf: z.string().min(1, "CPF é obrigatório."),
  dataNascimento: dateSchema,
  sexo: z.enum(["Masculino", "Feminino", "Outro"]),
  etnia: z.string().min(1, "Etnia é obrigatória."),
  escolaridade: z.string().min(1, "Escolaridade é obrigatória."),
  cargo: z.string().min(1, "O cargo/função é obrigatório."), // Ex: Presidente, Motorista
  tipoVinculo: z.enum(["COOP", "RPA"]),
  status: z.enum(["ATIVO", "INATIVO", "PENDENTE"]),
  dataEntrada: dateSchema,
  dataSaida: dateSchema.nullable().optional(),
  unidadeId: z.string().optional(),
});

export const createCooperadoSchema = {
  body: cooperadoBodyBase,
};

export const updateCooperadoSchema = {
  params,
  body: cooperadoBodyBase.partial(),
};

export const getCooperadoSchema = {
  params,
};

export const deleteCooperadoSchema = {
  params,
};
