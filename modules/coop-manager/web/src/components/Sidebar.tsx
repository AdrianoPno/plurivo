"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, Building2, Settings, LogOut, LayoutGrid } from "lucide-react";
import Cookies from "js-cookie";
import { signOut } from "firebase/auth";
import { cn } from "@shared/utils/cn";
import { firebaseAuth as auth } from "@shared/firebase/auth";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Cooperados", href: "/dashboard/cooperados", icon: Users },
  { name: "Unidades", href: "/dashboard/unidades", icon: Building2 },
  { name: "Usuários", href: "/dashboard/usuarios", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    localStorage.removeItem("coop-manager-api-token");
    Cookies.remove("session", { path: "/" });

    try {
      await signOut(auth);
    } finally {
      router.replace("/login");
    }
  }

  return (
    <aside className="hidden h-screen w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-950 text-slate-100 lg:flex">
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-800 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-lg shadow-black/20">
              <Building2 className="size-5" />
            </div>

            <div className="space-y-0.5">
              <h1 className="text-sm font-semibold tracking-tight text-white">
                Coop Manager
              </h1>

              <p className="text-xs font-medium text-slate-400">
                Gestão de cooperados
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-6">
          <div className="mb-3 px-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
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
                  href={item.href as any}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400 shadow-lg shadow-black/10 ring-1 ring-emerald-500/30"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200",
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-5 transition-all duration-200",
                      isActive
                        ? "text-emerald-400"
                        : "text-slate-500 group-hover:scale-105 group-hover:text-slate-300",
                    )}
                  />

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 border-t border-slate-800 px-6 py-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
            <p className="text-xs font-semibold text-white">Coop Manager</p>

            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              Sistema integrado de gestão de cooperados e unidades.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-400 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="size-5 text-slate-500 transition-colors duration-200 group-hover:text-red-400" />

            <span>Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
