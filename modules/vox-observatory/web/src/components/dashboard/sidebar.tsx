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
    <aside className="hidden h-screen w-72 flex-col border-r border-white/10 bg-[hsl(var(--sidebar-background))] md:flex">
      <div className="flex h-full flex-col">
        <div className="border-b border-white/10 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white shadow-lg shadow-black/20">
              <BotMessageSquare className="size-5 text-white" />
            </div>

            <div className="space-y-0.5">
              <h1 className="text-sm font-semibold tracking-tight text-white">
                Vox Observatory
              </h1>

              <p className="text-xs font-medium text-white/70">
                Research Intelligence
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-6">
          <div className="mb-3 px-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
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
                      ? "bg-white/12 text-white shadow-lg shadow-black/10 ring-1 ring-white/10"
                      : "text-white/80 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-5 transition-all duration-200",
                      isActive
                        ? "text-white"
                        : "text-white/65 group-hover:scale-105 group-hover:text-white",
                    )}
                  />

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 border-t border-white/10 px-6 py-5">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-sm">
            <p className="text-xs font-semibold text-white">Vox Platform</p>

            <p className="mt-1.5 text-xs leading-relaxed text-white/70">
              Plataforma de inteligência e observabilidade de pesquisas.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white/85 transition-all duration-200 hover:border-red-300/20 hover:bg-red-500/15 hover:text-red-200"
          >
            <LogOut className="size-5 text-white/70 transition-colors duration-200 group-hover:text-red-200" />

            <span>Sair da plataforma</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
