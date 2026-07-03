"use client";

import { Building2, BriefcaseBusiness, LayoutGrid, Settings, UserCog, Users } from "lucide-react";
import { ModuleSidebar } from "@shared/ui/module-sidebar";

const navigation = [
  { name: "Visao geral", href: "/dashboard", icon: LayoutGrid },
  { name: "Pessoas", href: "/dashboard/cooperados", icon: Users },
  { name: "Cargos e vagas", href: "/dashboard/cooperados/cargos", icon: BriefcaseBusiness },
  { name: "Unidades", href: "/dashboard/unidades", icon: Building2 },
  { name: "Usuarios", href: "/dashboard/usuarios", icon: UserCog },
  { name: "Configuracoes", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <ModuleSidebar
      moduleName="Pessoas e Unidades"
      moduleDescription="Pessoas, cargos, vagas e unidades operacionais."
      icon={Users}
      navigation={navigation}
    />
  );
}
