import { z } from "zod";

const params = z.object({
  id: z.string().min(1, "ID e obrigatorio."),
});

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato YYYY-MM-DD")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && value === date.toISOString().slice(0, 10);
  }, "Data invalida.");

const normalizeText = (value: string) => value.trim().replace(/\s+/g, " ");
const onlyDigits = (value: string) => value.replace(/\D/g, "");

const requiredText = (message: string) =>
  z.string().transform(normalizeText).pipe(z.string().min(1, message));

const isValidCpf = (value: string) => {
  const cpf = onlyDigits(value);

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  const calculateDigit = (base: string, factor: number) => {
    const total = base
      .split("")
      .reduce((sum, digit) => sum + Number(digit) * factor--, 0);
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const digit1 = calculateDigit(cpf.slice(0, 9), 10);
  const digit2 = calculateDigit(cpf.slice(0, 10), 11);

  return digit1 === Number(cpf[9]) && digit2 === Number(cpf[10]);
};

const cooperadoObjectSchema = z.object({
  ID_COOPERADO: requiredText("Matricula e obrigatoria."),
  nome: requiredText("Nome e obrigatorio.").pipe(
    z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  ),
  cpf: z
    .string()
    .transform(onlyDigits)
    .pipe(z.string().length(11, "CPF deve ter 11 digitos."))
    .refine(isValidCpf, "CPF invalido."),
  dataNascimento: dateSchema,
  sexo: z.enum(["Masculino", "Feminino", "Outro"]),
  etnia: requiredText("Etnia e obrigatoria."),
  escolaridade: requiredText("Escolaridade e obrigatoria."),
  cargo: requiredText("O cargo/funcao e obrigatorio."),
  tipoVinculo: z.enum(["COOP", "RPA"]),
  status: z.enum(["ATIVO", "INATIVO", "PENDENTE"]),
  dataEntrada: dateSchema,
  dataSaida: dateSchema.nullable().optional(),
  unidadeId: z.string().optional(),
});

const validateCooperadoDates = (
  data: { dataEntrada?: string; dataSaida?: string | null },
  ctx: z.RefinementCtx,
) => {
  if (data.dataEntrada && data.dataSaida && data.dataSaida < data.dataEntrada) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["dataSaida"],
      message: "Data de saida nao pode ser anterior a data de entrada.",
    });
  }
};

const createCooperadoBodySchema =
  cooperadoObjectSchema.superRefine(validateCooperadoDates);

const updateCooperadoBodySchema = cooperadoObjectSchema
  .partial()
  .superRefine(validateCooperadoDates);

export const createCooperadoSchema = {
  body: createCooperadoBodySchema,
};

export const updateCooperadoSchema = {
  params,
  body: updateCooperadoBodySchema,
};

export const getCooperadoSchema = {
  params,
};

export const deleteCooperadoSchema = {
  params,
};
