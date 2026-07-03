"use client";

import { BarChart3, BotMessageSquare, Library } from "lucide-react";

import { useAuth } from "@shared/auth";
import { MODULE_IDS, MODULE_URLS } from "@shared/constants/modules";
import { ModuleSettingsPage } from "@shared/ui/module-settings-page";

const permissionCapabilities = {
  SUPER: [
    "Acessar todos os modulos e telas da plataforma.",
    "Gerenciar usuarios, permissoes e acessos pela Platform.",
    "Visualizar e operar todas as pesquisas da organizacao.",
  ],
  ADMIN: [
    "Criar, editar e acompanhar pesquisas.",
    "Visualizar analytics e indicadores do observatorio.",
    "Acessar configuracoes operacionais do modulo.",
  ],
  USER: [
    "Acessar pesquisas permitidas para sua conta.",
    "Acompanhar informacoes operacionais do modulo.",
    "Usar recursos liberados pelo administrador.",
  ],
  VIEWER: [
    "Visualizar biblioteca e dados liberados.",
    "Consultar analytics quando permitido.",
    "Sem permissao para criar, editar ou excluir registros.",
  ],
};

const preferences = [
  {
    label: "Pagina inicial",
    value: "Biblioteca de pesquisas",
  },
  {
    label: "Densidade visual",
    value: "Confortavel",
  },
  {
    label: "Analises",
    value: "Indicadores consolidados do observatorio",
  },
];

const adminActions = [
  {
    label: "Biblioteca",
    href: "/dashboard",
    description: "Consultar e organizar as pesquisas disponiveis.",
    icon: Library,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    description: "Acompanhar indicadores e distribuicoes das pesquisas.",
    icon: BarChart3,
  },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const voxApiUrl =
    process.env.NEXT_PUBLIC_VOX_OBSERVATORY_API_URL ||
    MODULE_URLS.voxObservatory.api;

  return (
    <main className="p-6 md:p-10">
      <ModuleSettingsPage
        user={user}
        moduleId={MODULE_IDS.VOX_OBSERVATORY}
        moduleName="Pesquisas e Insights"
        moduleDescription="Preferencias, permissoes e informacoes de suporte do observatorio de pesquisas."
        moduleIcon={BotMessageSquare}
        moduleApiUrl={voxApiUrl}
        accessDescription="Veja seu nivel de acesso e quais acoes estao liberadas para sua conta."
        permissionCapabilities={permissionCapabilities}
        preferences={preferences}
        adminActions={adminActions}
      />
    </main>
  );
}
