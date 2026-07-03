export const TENANT_THEME_PRESETS = {
  institutional: {
    label: "Institucional",
    description: "Sobrio e adequado para operacoes administrativas.",
    primary: "222 47% 24%",
    accent: "199 89% 48%",
    ring: "199 89% 48%",
  },
  environmental: {
    label: "Ambiental",
    description: "Verde equilibrado para iniciativas socioambientais.",
    primary: "158 64% 24%",
    accent: "142 71% 45%",
    ring: "142 71% 45%",
  },
  technology: {
    label: "Tecnologia",
    description: "Contraste contemporaneo para produtos digitais.",
    primary: "243 47% 28%",
    accent: "263 70% 58%",
    ring: "263 70% 58%",
  },
  neutral: {
    label: "Neutro",
    description: "Base discreta que valoriza o conteudo.",
    primary: "220 9% 24%",
    accent: "174 72% 40%",
    ring: "174 72% 40%",
  },
  contrast: {
    label: "Alto contraste",
    description: "Leitura reforcada para ambientes operacionais.",
    primary: "0 0% 9%",
    accent: "45 93% 47%",
    ring: "45 93% 47%",
  },
} as const;

export type TenantThemePreset = keyof typeof TENANT_THEME_PRESETS;

export const DEFAULT_TENANT_THEME: TenantThemePreset = "institutional";
