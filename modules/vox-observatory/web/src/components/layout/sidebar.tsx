"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BotMessageSquare,
  Library,
  LogOut,
  Settings,
} from "lucide-react";
import Cookies from "js-cookie";
import { signOut } from "firebase/auth";
import { useAuthStore } from "@/store/use-auth-store";
import { cn } from "@shared/utils/cn";
import { firebaseAuth } from "@shared/firebase/auth";

const navigation = [
  { name: "Biblioteca", href: "/dashboard", icon: Library },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Configurações", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { clearAuth } = useAuthStore();

  async function handleLogout() {
    localStorage.removeItem("vox-api-token");
    Cookies.remove("session", { path: "/" });
    clearAuth();

    try {
      await signOut(firebaseAuth);
    } finally {
      router.replace("/login");
    }
  }

  return (
    <aside className="hidden h-screen w-72 flex-col border-r border-white/5 bg-[hsl(var(--sidebar-background))] md:flex">
      <div className="flex h-full flex-col">
        <div className="border-b border-white/5 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[hsl(var(--sidebar-accent))] shadow-lg shadow-black/20">
              <BotMessageSquare className="size-5 text-[hsl(var(--sidebar-accent-foreground))]" />
            </div>

            <div className="space-y-0.5">
              <h1 className="text-sm font-semibold tracking-tight text-white">
                Vox Observatory
              </h1>
              <p className="text-xs text-[hsl(var(--sidebar-muted))]">
                Research Intelligence
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-6">
          <div className="mb-3 px-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[hsl(var(--sidebar-muted))]">
              Navegação
            </span>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[hsl(var(--sidebar-accent))] text-white shadow-lg shadow-black/10"
                      : "text-[hsl(var(--sidebar-foreground))] hover:bg-white/5 hover:text-white",
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-5 transition-transform duration-200",
                      isActive
                        ? "scale-100"
                        : "text-[hsl(var(--sidebar-muted))] group-hover:scale-105 group-hover:text-white",
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 border-t border-white/5 px-6 py-5">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
            <p className="text-xs font-medium text-white">Vox Platform</p>
            <p className="mt-1 text-xs leading-relaxed text-[hsl(var(--sidebar-muted))]">
              Plataforma de inteligência e observabilidade de pesquisas.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm font-medium text-[hsl(var(--sidebar-foreground))] transition-all duration-200 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="size-5 text-[hsl(var(--sidebar-muted))] transition-colors group-hover:text-red-300" />
            <span>Sair da plataforma</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
