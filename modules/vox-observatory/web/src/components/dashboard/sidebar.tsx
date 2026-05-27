"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  BotMessageSquare,
  Library,
  LogOut,
  Settings,
} from "lucide-react";

import { useAuth } from "@shared/auth";
import { Button } from "@shared/ui/button";
import { cn } from "@shared/utils/cn";

const navigation = [
  {
    name: "Biblioteca",
    href: "/dashboard",
    icon: Library,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
  }

  return (
    <aside className="hidden h-screen w-72 flex-col border-r border-primary-foreground/10 bg-[hsl(var(--sidebar-background))] text-primary-foreground md:flex">
      <div className="flex h-full flex-col">
        <div className="border-b border-primary-foreground/10 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-primary-foreground/10 bg-primary-foreground/10 text-primary-foreground shadow-sm">
              <BotMessageSquare className="size-5 text-primary-foreground" />
            </div>

            <div className="space-y-0.5">
              <h1 className="text-sm font-semibold tracking-tight text-primary-foreground">
                Vox Observatory
              </h1>

              <p className="text-xs font-medium text-primary-foreground/70">
                Research Intelligence
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-6">
          <div className="mb-3 px-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">
              Navegação
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
                    "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary-foreground/15 text-primary-foreground shadow-sm ring-1 ring-primary-foreground/10"
                      : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground",
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-5 transition-all duration-200",
                      isActive
                        ? "text-primary-foreground"
                        : "text-primary-foreground/65 group-hover:scale-105 group-hover:text-primary-foreground",
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
              Vox Platform
            </p>

            <p className="mt-1.5 text-xs leading-relaxed text-primary-foreground/70">
              Plataforma de inteligência e observabilidade de pesquisas.
            </p>
          </div>

          <Button
            type="button"
            onClick={handleLogout}
            variant="ghost"
            className="group flex w-full items-center gap-3 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/10 px-4 py-3 text-sm font-semibold text-primary-foreground/85 transition-all duration-200 hover:border-red-300/20 hover:bg-red-500/15 hover:text-red-200"
          >
            <LogOut className="size-5 text-primary-foreground/70 transition-colors duration-200 group-hover:text-red-200" />

            <span>Sair da plataforma</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
