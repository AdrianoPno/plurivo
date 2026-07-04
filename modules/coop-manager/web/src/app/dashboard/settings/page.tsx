"use client";

import {
  BriefcaseBusiness,
  Building2,
  LayoutGrid,
  Users,
} from "lucide-react";

import { useAuth } from "@shared/auth";
import { MODULE_IDS, MODULE_URLS } from "@shared/constants/modules";
import { ModuleSettingsPage } from "@shared/ui/module-settings-page";

const permissionCapabilities = {
  SUPER: [
    "Acessar todos os modulos e todas as unidades.",
    "Gerenciar usuarios, permissoes e acessos pela Platform.",
    "Operar cooperados, unidades, cargos e indicadores sem restricao de unidade.",
  ],
  ADMIN: [
    "Gerenciar dados operacionais dentro do escopo permitido.",
    "Cadastrar, editar e acompanhar cooperados da unidade vinculada.",
    "Acompanhar indicadores e alertas operacionais.",
  ],
  USER: [
    "Cadastrar e atualizar cooperados quando permitido.",
    "Consultar informacoes da unidade vinculada.",
    "Acompanhar rotinas operacionais liberadas pelo administrador.",
  ],
  VIEWER: [
    "Visualizar dados operacionais liberados.",
    "Consultar dashboard, cooperados e unidades conforme escopo.",
    "Sem permissao para criar, editar ou excluir registros.",
  ],
};

const preferences = [
  {
    label: "Pagina inicial",
    value: "Dashboard operacional",
  },
  {
    label: "Listas",
    value: "Exibir registros ativos e recentes primeiro",
  },
  {
    label: "Escopo",
    value: "Respeitar unidade vinculada ao usuario quando aplicavel",
  },
];

const adminActions = [
  {
    label: "Cooperados",
    href: "/dashboard/cooperados",
    description: "Cadastrar, editar e consultar cooperados.",
    icon: Users,
  },
  {
    label: "Cargos e vagas",
    href: "/dashboard/cooperados/cargos",
    description: "Configurar cargos e limites de vagas.",
    icon: BriefcaseBusiness,
  },
  {
    label: "Unidades",
    href: "/dashboard/unidades",
    description: "Gerenciar unidades operacionais.",
    icon: Building2,
  },
  {
    label: "Usuarios",
    href: "/dashboard/usuarios",
    description: "Consultar usuarios vinculados ao modulo.",
    icon: Users,
  },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const coopApiUrl =
    process.env.NEXT_PUBLIC_PEOPLE_API_URL ||
    process.env.NEXT_PUBLIC_COOP_MANAGER_API_URL ||
    MODULE_URLS.coopManager.api;

  return (
    <ModuleSettingsPage
      user={user}
      moduleId={MODULE_IDS.COOP_MANAGER}
      moduleName="Pessoas e Unidades"
      moduleDescription="Preferencias, permissoes e informacoes de suporte da gestao de cooperados."
      moduleIcon={LayoutGrid}
      moduleApiUrl={coopApiUrl}
      accessDescription="Veja seu nivel de acesso e o escopo operacional liberado para sua conta."
      permissionCapabilities={permissionCapabilities}
      preferences={preferences}
      adminActions={adminActions}
    />
  );
}
