import type { ElementType } from "react";
import { Factory, Users } from "lucide-react";

/**
 * URLs base para os serviços de cada módulo.
 * Padroniza o acesso às APIs e aplicações web.
 */
export const MODULE_URLS = {
  platformShell: {
    web:
      process.env.NEXT_PUBLIC_PLURIVO_WEB_URL ||
      process.env.PLURIVO_WEB_URL ||
      process.env.NEXT_PUBLIC_PLATFORM_SHELL_WEB_URL ||
      "http://localhost:3001",
    api:
      process.env.NEXT_PUBLIC_PLURIVO_API_URL ||
      process.env.PLURIVO_API_URL ||
      process.env.NEXT_PUBLIC_PLATFORM_SHELL_API_URL ||
      "http://localhost:3000/api",
  },

  voxObservatory: {
    web:
      process.env.NEXT_PUBLIC_RESEARCH_WEB_URL ||
      process.env.RESEARCH_WEB_URL ||
      process.env.NEXT_PUBLIC_VOX_OBSERVATORY_WEB_URL ||
      "http://localhost:3003",
    api:
      process.env.NEXT_PUBLIC_RESEARCH_API_URL ||
      process.env.RESEARCH_API_URL ||
      process.env.NEXT_PUBLIC_VOX_OBSERVATORY_API_URL ||
      "http://localhost:3002",
  },

  coopManager: {
    web:
      process.env.NEXT_PUBLIC_PEOPLE_WEB_URL ||
      process.env.PEOPLE_WEB_URL ||
      process.env.NEXT_PUBLIC_COOP_MANAGER_WEB_URL ||
      "http://localhost:3005",
    api:
      process.env.NEXT_PUBLIC_PEOPLE_API_URL ||
      process.env.PEOPLE_API_URL ||
      process.env.NEXT_PUBLIC_COOP_MANAGER_API_URL ||
      "http://localhost:3004/api",
  },
} as const;

/**
 * IDs oficiais dos módulos da plataforma.
 */
export const MODULE_IDS = {
  COOP_MANAGER: "coop-manager",
  VOX_OBSERVATORY: "vox-observatory",
} as const;

export const MODULES = MODULE_IDS;

export type ModuleId = (typeof MODULE_IDS)[keyof typeof MODULE_IDS];

/**
 * Valida se um valor recebido é um ModuleId válido.
 *
 * Útil principalmente quando o moduleId vem do banco, API,
 * token, permissões do usuário etc.
 */
export function isModuleId(value: unknown): value is ModuleId {
  return (
    typeof value === "string" &&
    Object.values(MODULE_IDS).includes(value as ModuleId)
  );
}

/**
 * Configuração usada para renderizar os cards no Platform Shell.
 */
export interface ModuleConfig {
  id: ModuleId;
  name: string;
  description: string;
  url: string;
  Icon: ElementType;
}

/**
 * Lista dos módulos exibidos no portal.
 */
export const MODULE_CONFIGS: ModuleConfig[] = [
  {
    id: MODULE_IDS.COOP_MANAGER,
    name: "Pessoas e Unidades",
    description: "Gestao de pessoas, cargos, vagas e unidades operacionais.",
    url: MODULE_URLS.coopManager.web,
    Icon: Users,
  },
  {
    id: MODULE_IDS.VOX_OBSERVATORY,
    name: "Pesquisas e Insights",
    description: "Pesquisas, descobertas, indicadores e inteligencia organizacional.",
    url: MODULE_URLS.voxObservatory.web,
    Icon: Factory,
  },
];
