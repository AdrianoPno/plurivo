import { z } from "zod";
import { MODULES } from "@shared/constants/modules";

const UserRoleEnum = z.enum(["SUPER", "ADMIN", "USER"]);

export const getUserSchema = {
  params: z.object({
    id: z.string().min(1, "O ID do usuário é obrigatório."),
  }),
};

export const createUserSchema = {
  body: z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    role: UserRoleEnum,
    permissions: z
      .array(
        z.object({
          moduleId: z.nativeEnum(MODULES),
          role: z.enum(["ADMIN", "VIEWER", "USER"]),
        }),
      )
      .default([]),
    unidadeId: z.string().optional(),
  }),
};

export const updateUserSchema = {
  params: z.object({
    id: z.string().min(1, "O ID do usuário é obrigatório."),
  }),
  body: z.object({
    nome: z.string().optional(),
    unidadeId: z.string().optional(),
    role: UserRoleEnum.optional(),
    ativo: z.boolean().optional(),
  }),
};

export const deleteUserSchema = {
  params: z.object({
    id: z.string().min(1, "O ID do usuário é obrigatório."),
  }),
};
