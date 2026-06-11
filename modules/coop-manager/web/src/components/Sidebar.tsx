"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  Building2,
  BriefcaseBusiness,
  LayoutGrid,
  LogOut,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

import { useAuth } from "@shared/auth";
import { Button } from "@shared/ui/button";
import { cn } from "@shared/utils/cn";

type NavigationItem = {
  name: string;
  href: Route;
  icon: LucideIcon;
};

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Cooperados", href: "/dashboard/cooperados", icon: Users },
  { name: "Cargos", href: "/dashboard/cooperados/cargos", icon: BriefcaseBusiness },
  { name: "Unidades", href: "/dashboard/unidades", icon: Building2 },
  { name: "Usuarios", href: "/dashboard/usuarios", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="hidden h-screen w-72 shrink-0 flex-col border-r border-primary/20 bg-primary text-primary-foreground lg:flex">
      <div className="flex h-full flex-col">
        <div className="border-b border-primary-foreground/10 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-primary-foreground/10 bg-primary-foreground/10 text-primary-foreground shadow-sm">
              <Building2 className="size-5" />
            </div>

            <div className="space-y-0.5">
              <h1 className="text-sm font-semibold tracking-tight text-primary-foreground">
                Coop Manager
              </h1>
              <p className="text-xs font-medium text-primary-foreground/70">
                Gestao de cooperados
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-6">
          <div className="mb-3 px-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/55">
              Navegacao
            </span>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-primary-foreground text-primary shadow-sm ring-1 ring-primary-foreground/20"
                      : "text-primary-foreground/75 hover:bg-primary-foreground/10 hover:text-primary-foreground",
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-5 transition-all duration-200",
                      isActive
                        ? "text-primary"
                        : "text-primary-foreground/55 group-hover:scale-105 group-hover:text-primary-foreground",
                    )}
                  />

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 border-t border-primary-foreground/10 px-6 py-5">
          <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/10 p-4 shadow-sm">
            <p className="text-xs font-semibold text-primary-foreground">
              Coop Manager
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-primary-foreground/70">
              Sistema integrado de gestao de cooperados e unidades.
            </p>
          </div>

          <Button
            type="button"
            onClick={logout}
            variant="ghost"
            className="group flex w-full items-center gap-3 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/10 px-4 py-3 text-sm font-semibold text-primary-foreground/75 transition-all duration-200 hover:border-red-300/20 hover:bg-red-500/15 hover:text-red-100"
          >
            <LogOut className="size-5 text-primary-foreground/55 transition-colors duration-200 group-hover:text-red-100" />
            <span>Sair</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
