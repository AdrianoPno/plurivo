import { z } from "zod";

export const loginBodySchema = z.object({
  idToken: z.string(),
});

export type LoginBody = z.infer<typeof loginBodySchema>;

export const loginResponseSchema = z.object({
  token: z.string(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const authSchemas = {
  loginBodySchema,
  loginResponseSchema,
};
