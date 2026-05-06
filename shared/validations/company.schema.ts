import { z } from "zod";

export const companySchema = z.object({
  id: z.string().optional(),

  name: z
    .string()
    .min(1, "O nome da empresa é obrigatório")
    .min(2, "O nome deve ter pelo menos 2 caracteres"),

  document: z
    .string()
    .min(1, "O CNPJ é obrigatório")
    .min(14, "Informe um CNPJ válido"),

  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("Informe um e-mail válido"),

  phone: z
    .string()
    .min(1, "O telefone é obrigatório")
    .min(10, "Informe um telefone válido"),

  address: z.object({
    street: z.string().optional(),
    number: z.string().optional(),
    district: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  }),

  active: z.boolean().default(true),
});

export type CompanySchema = z.infer<typeof companySchema>;
