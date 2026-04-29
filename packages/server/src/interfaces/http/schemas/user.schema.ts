import { z } from "zod";

export const userSchema = z.object({
  uid: z.string(),
  nome: z.string(),
  email: z.string().email(),
  role: z.enum(["ADMIN", "VIEWER", "SUPER"]),
  status: z.enum(["ativo", "inativo"]).default("ativo"),
});

export type UserType = z.infer<typeof userSchema>;

export const userSchemas = {
  userSchema,
};
