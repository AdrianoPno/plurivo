import { z } from "zod";

export const userSchema = z.object({
  id: z.string().optional(),

  name: z
    .string()
    .min(1, "O nome é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres"),

  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("Informe um e-mail válido"),

  role: z.enum(["ADMIN", "MANAGER", "USER"], {
    message: "O perfil é obrigatório",
  }),

  companyId: z.string().optional(),

  sectorId: z.string().optional(),

  photoUrl: z.string().url("Informe uma URL válida").optional(),

  active: z.boolean().default(true),
});

export type UserSchema = z.infer<typeof userSchema>;
