"use client";

import { BarChart3, Lightbulb, Library, Settings } from "lucide-react";
import { ModuleSidebar } from "@shared/ui/module-sidebar";

const navigation = [
  { name: "Biblioteca", href: "/dashboard", icon: Library },
  { name: "Indicadores", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Configuracoes", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <ModuleSidebar
      moduleName="Pesquisas e Insights"
      moduleDescription="Pesquisas, descobertas e inteligencia organizacional."
      icon={Lightbulb}
      navigation={navigation}
    />
  );
}
