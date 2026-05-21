/**
 * Identificadores únicos para cada módulo da plataforma.
 * Essencial para o Single Sign-On e controle de acesso granular.
 */
export const MODULES = {
  COOP_MANAGER: "coop-manager",
  VOX_OBSERVATORY: "vox-observatory",
  PLATFORM_SHELL: "platform-shell",
} as const;

export type ModuleID = (typeof MODULES)[keyof typeof MODULES];
