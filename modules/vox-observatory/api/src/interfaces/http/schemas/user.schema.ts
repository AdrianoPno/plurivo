import { z } from "zod";

export const userResponseSchema = z.object({
  uid: z.string(),
  nome: z.string(),
  email: z.string().email(),
  role: z.enum(["ADMIN", "VIEWER", "SUPER"]),
  status: z.enum(["ativo", "inativo"]),
});

export type UserType = z.infer<typeof userResponseSchema>;

export const updateUserBodySchema = z.object({
  nome: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .optional(),
});

export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;
