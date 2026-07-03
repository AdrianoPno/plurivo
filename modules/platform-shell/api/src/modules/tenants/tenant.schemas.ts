import { MODULE_IDS } from "@shared/constants/modules.js";
import { z } from "zod";

const brandingSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  logoUrl: z.string().url().optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Cor deve estar no formato hexadecimal.")
    .optional(),
});

export const tenantBodySchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use letras minusculas, numeros e hifens."),
  legalName: z.string().trim().min(2).max(120),
  branding: brandingSchema,
  activeModules: z.array(z.nativeEnum(MODULE_IDS)).default([]),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const updateTenantBodySchema = tenantBodySchema.partial();

export const tenantParamsSchema = z.object({
  id: z.string().min(1),
});
