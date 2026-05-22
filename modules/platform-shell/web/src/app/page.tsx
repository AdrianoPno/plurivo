"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  LogOut,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { PrivateRoute } from "@shared/auth/private-route.js";
import { useAuth } from "@shared/auth/auth-context.js";
import { MODULE_CONFIGS, ModuleConfig } from "@shared/constants/modules.js";
import { Button } from "@shared/ui/button";

function ModuleCard({ module }: { module: ModuleConfig }) {
  return (
    <Link
      href={module.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex min-h-[230px] flex-col overflow-hidden rounded-3xl border border-border/70 bg-card p-7 text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary">
        <module.Icon className="h-7 w-7" />
      </div>

      <div className="relative mt-7 flex-1">
        <h3 className="text-xl font-semibold tracking-tight">{module.name}</h3>

        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          {module.description}
        </p>
      </div>

      <div className="relative mt-7 flex items-center justify-between border-t border-border/70 pt-5">
        <span className="text-sm font-medium text-primary">Acessar módulo</span>

        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:translate-x-1 group-hover:bg-primary group-hover:text-primary-foreground">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();

  const availableModules = useMemo(() => {
    if (!user) return [];

    if (user.role === "SUPER") {
      return MODULE_CONFIGS;
    }

    const userModuleIds = user.permissions.map(
      (permission) => permission.moduleId,
    );

    return MODULE_CONFIGS.filter((module) => userModuleIds.includes(module.id));
  }, [user]);

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm md:flex">
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Portal de Módulos
              </h1>

              {user && (
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    Olá,{" "}
                    <strong className="font-semibold text-foreground">
                      {user.nome}
                    </strong>
                  </span>

                  <span className="hidden sm:inline">•</span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    {user.role}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(user?.role === "SUPER" || user?.role === "ADMIN") && (
              <Button asChild variant="outline">
                <Link href="/users">
                  <Users className="mr-2 h-4 w-4" />
                  Gerenciar Usuários
                </Link>
              </Button>
            )}

            <Button onClick={logout} variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_34rem),radial-gradient(circle_at_top_right,hsl(var(--accent)/0.12),transparent_30rem)]" />

        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="mb-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Workspace
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Escolha o módulo que deseja acessar
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Acesse rapidamente os módulos disponíveis para sua conta e
              continue sua operação dentro da plataforma Recicleiros.
            </p>
          </div>

          {availableModules.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {availableModules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-card p-8 shadow-sm">
              <h3 className="text-lg font-semibold">
                Nenhum módulo disponível
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Você não tem permissão para acessar nenhum módulo no momento.
                Entre em contato com um administrador para revisar suas
                permissões.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function HomePage() {
  return (
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  );
}
