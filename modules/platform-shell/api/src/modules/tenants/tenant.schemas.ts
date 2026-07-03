import { MODULE_IDS } from "@shared/constants/modules.js";
import { TENANT_THEME_PRESETS } from "@shared/design/tenant-themes.js";
import { z } from "zod";

const brandingSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  themePreset: z.enum(
    Object.keys(TENANT_THEME_PRESETS) as [
      keyof typeof TENANT_THEME_PRESETS,
      ...(keyof typeof TENANT_THEME_PRESETS)[],
    ],
  ),
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
