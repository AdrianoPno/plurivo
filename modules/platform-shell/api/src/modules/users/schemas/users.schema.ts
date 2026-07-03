import { z } from "zod";

import { MODULE_IDS } from "@shared/constants/modules.js";

const UserRoleEnum = z.enum(["SUPER", "ADMIN", "USER"]);

const permissionSchema = z.object({
  moduleId: z.nativeEnum(MODULE_IDS),
  role: z.enum(["ADMIN", "VIEWER", "USER"]),
});

const userResponseSchema = z.object({
  uid: z.string(),
  nome: z.string(),
  email: z.string().email(),
  role: UserRoleEnum,
  ativo: z.boolean(),
  tenantId: z.string().optional().nullable(),
  unidadeId: z.string().optional().nullable(),
  permissions: z.array(permissionSchema),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const getUserSchema = {
  schema: {
    security: [{ bearerAuth: [] }],
    params: z.object({
      id: z.string().min(1, "O ID do usuário é obrigatório."),
    }),
    response: {
      200: z.object({
        success: z.boolean(),
        data: userResponseSchema,
      }),
    },
  },
};

export const createUserSchema = {
  schema: {
    security: [{ bearerAuth: [] }],
    body: z.object({
      nome: z.string().min(1, "Nome é obrigatório"),
      email: z.string().email("E-mail inválido"),
      password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
      role: UserRoleEnum,
      permissions: z.array(permissionSchema).default([]),
      unidadeId: z.string().optional(),
      tenantId: z.string().optional(),
    }),
    response: {
      201: z.object({
        success: z.boolean(),
        data: z.object({
          uid: z.string(),
        }),
        message: z.string(),
      }),
    },
  },
};

export const updateUserSchema = {
  schema: {
    security: [{ bearerAuth: [] }],
    params: z.object({
      id: z.string().min(1, "O ID do usuário é obrigatório."),
    }),
    body: z.object({
      nome: z.string().optional(),
      unidadeId: z.string().optional(),
      tenantId: z.string().optional(),
      role: UserRoleEnum.optional(),
      ativo: z.boolean().optional(),
      permissions: z.array(permissionSchema).optional(),
    }),
    response: {
      200: z.object({
        success: z.boolean(),
        data: userResponseSchema,
        message: z.string(),
      }),
    },
  },
};

export const deleteUserSchema = {
  schema: {
    security: [{ bearerAuth: [] }],
    params: z.object({
      id: z.string().min(1, "O ID do usuário é obrigatório."),
    }),
    response: {
      200: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
  },
};
