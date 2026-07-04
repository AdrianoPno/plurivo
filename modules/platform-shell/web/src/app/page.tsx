"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  KeyRound,
  LogOut,
  ShieldCheck,
  Settings2,
  Sparkles,
  Users,
} from "lucide-react";

import { PrivateRoute } from "@shared/auth/private-route.js";
import { useAuth } from "@shared/auth/auth-context.js";
import {
  MODULE_CONFIGS,
  PLURIVO_HEALTH_URL,
} from "@shared/constants/modules";
import type { ModuleConfig } from "@shared/constants/modules";
import { useTenant } from "@shared/tenant";

import {
  AppContainer,
  AppGradient,
  AppHeader,
  AppHeaderInner,
  AppSection,
  AppShell,
} from "@shared/ui/app-layout";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/card";
import { ServiceStatus } from "@shared/ui/service-status";

function getModuleUrl(module: ModuleConfig) {
  const baseUrl = new URL(module.url);
  baseUrl.pathname = "/dashboard";

  return baseUrl.toString();
}

function getModuleUrlWithToken(module: ModuleConfig, token: string | null) {
  const baseUrl = new URL(getModuleUrl(module));

  if (token) {
    baseUrl.hash = new URLSearchParams({
      platform_token: token,
    }).toString();
  }

  return baseUrl.toString();
}

function ModuleCard({
  module,
  token,
}: {
  module: ModuleConfig;
  token: string | null;
}) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.assign(getModuleUrlWithToken(module, token));
  };

  return (
    <Link
      href={getModuleUrl(module)}
      onClick={handleClick}
      className="group relative flex min-h-[230px] flex-col overflow-hidden rounded-3xl border border-border/70 bg-card p-7 text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary">
          <module.Icon className="h-7 w-7" />
        </div>

        <ServiceStatus
          healthUrl={module.healthUrl}
          serviceName={module.name}
        />
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
  const { user, token, logout } = useAuth();
  const { tenant } = useTenant();

  const availableModules = useMemo(() => {
    if (!user) return [];

    if (user.role === "SUPER") {
      return MODULE_CONFIGS;
    }

    const userModuleIds = user.permissions.map(
      (permission) => permission.moduleId,
    );

    return MODULE_CONFIGS.filter(
      (module) =>
        userModuleIds.includes(module.id) &&
        (!tenant || tenant.activeModules.includes(module.id)),
    );
  }, [tenant, user]);

  return (
    <AppShell>
      <AppHeader>
        <AppHeaderInner>
          <div className="flex items-center gap-4">
            <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm md:flex">
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {tenant?.branding.displayName || "Portal de Modulos"}
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

                  <ServiceStatus
                    healthUrl={PLURIVO_HEALTH_URL}
                    serviceName="Plurivo API"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/account">
                <KeyRound className="mr-2 h-4 w-4" />
                Minha conta
              </Link>
            </Button>

            {(user?.role === "SUPER" || user?.role === "ADMIN") && (
              <Button asChild variant="outline">
                <Link href="/users">
                  <Users className="mr-2 h-4 w-4" />
                  Gerenciar Usuários
                </Link>
              </Button>
            )}

            {user?.role === "SUPER" && (
              <Button asChild variant="outline">
                <Link href="/admin/organizations">
                  <Settings2 className="mr-2 h-4 w-4" />
                  Organizacoes
                </Link>
              </Button>
            )}

            <Button onClick={logout} variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </AppHeaderInner>
      </AppHeader>

      <AppSection>
        <AppGradient />

        <AppContainer>
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
              continue sua operacao dentro de uma plataforma segura e integrada.
            </p>
          </div>

          {availableModules.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {availableModules.map((module) => (
                <ModuleCard key={module.id} module={module} token={token} />
              ))}
            </div>
          ) : (
            <Card className="rounded-3xl border-dashed p-8">
              <h3 className="text-lg font-semibold">
                Nenhum módulo disponível
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Você não tem permissão para acessar nenhum módulo no momento.
                Entre em contato com um administrador para revisar suas
                permissões.
              </p>
            </Card>
          )}
        </AppContainer>
      </AppSection>
    </AppShell>
  );
}

export default function HomePage() {
  return (
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  );
}
