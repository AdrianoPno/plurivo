"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, type LucideIcon } from "lucide-react";
import { useAuth } from "../auth";
import { useTenant } from "../tenant";
import { Button } from "./button";
import { cn } from "../utils/cn";

export interface ModuleNavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export function ModuleSidebar({ moduleName, moduleDescription, icon: Icon, navigation }: {
  moduleName: string;
  moduleDescription: string;
  icon: LucideIcon;
  navigation: ModuleNavigationItem[];
}) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { tenant } = useTenant();

  return (
    <aside className="hidden h-screen w-72 shrink-0 flex-col border-r border-primary-foreground/10 bg-[hsl(var(--primary))] text-primary-foreground lg:flex">
      <div className="flex h-full flex-col">
        <div className="border-b border-primary-foreground/10 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-primary-foreground/10 bg-primary-foreground/10 shadow-sm"><Icon className="size-5" /></div>
            <div className="min-w-0 space-y-0.5">
              <h1 className="truncate text-sm font-semibold">{moduleName}</h1>
              <p className="truncate text-xs font-medium text-primary-foreground/70">{tenant?.branding.displayName || "Plataforma integrada"}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/60">Navegacao</p>
          <nav className="flex flex-col gap-1.5">
            {navigation.map((item) => {
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={{ pathname: item.href }} className={cn("group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200", active ? "bg-primary-foreground/15 text-primary-foreground shadow-sm ring-1 ring-primary-foreground/10" : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground")}>
                  <item.icon className="size-5" /><span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="space-y-4 border-t border-primary-foreground/10 px-6 py-5">
          <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/10 p-4 shadow-sm">
            <p className="text-xs font-semibold">{moduleName}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-primary-foreground/70">{moduleDescription}</p>
          </div>
          <Button type="button" onClick={logout} variant="ghost" className="flex w-full items-center gap-3 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/10 px-4 py-3 text-primary-foreground/85 hover:bg-destructive/20 hover:text-primary-foreground">
            <LogOut className="size-5" /><span>Sair da plataforma</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
