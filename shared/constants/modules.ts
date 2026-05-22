import { Factory, Users } from "lucide-react";

export const MODULES = {
  COOP_MANAGER: "coop-manager",
  VOX_OBSERVATORY: "vox-observatory",
  PLATFORM_SHELL: "platform-shell",
} as const;

export type ModuleId = (typeof MODULES)[keyof typeof MODULES];

export interface ModuleConfig {
  id: ModuleId;
  name: string;
  description: string;
  url: string;
  Icon: React.ElementType;
}

export const MODULE_CONFIGS: ModuleConfig[] = [
  {
    id: MODULES.COOP_MANAGER,
    name: "Coop Manager",
    description: "Gerenciamento de cooperados e unidades operacionais.",
    url: process.env.NEXT_PUBLIC_COOP_MANAGER_URL || "http://localhost:3005",
    Icon: Users,
  },
  {
    id: MODULES.VOX_OBSERVATORY,
    name: "Vox Observatory",
    description: "Inteligência de pesquisa e laboratório de dados.",
    url: process.env.NEXT_PUBLIC_VOX_URL || "http://localhost:3006/dashboard",
    Icon: Factory,
  },
];
