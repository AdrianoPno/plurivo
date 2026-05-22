"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, LogOut, ShieldCheck, Users } from "lucide-react";

import { PrivateRoute } from "@shared/auth/private-route.js";
import { useAuth } from "@shared/auth/auth-context.js";
import { MODULE_CONFIGS, ModuleConfig } from "@shared/constants/modules.js";
import { Button } from "@shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/card";

function ModuleCard({ module }: { module: ModuleConfig }) {
  return (
    <Link
      href={module.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <module.Icon className="h-6 w-6" />
      </div>

      <div className="mt-6 space-y-2">
        <h3 className="text-lg font-semibold tracking-tight text-card-foreground">
          {module.name}
        </h3>

        <p className="min-h-10 text-sm leading-6 text-muted-foreground">
          {module.description}
        </p>
      </div>

      <div className="mt-6 flex items-center text-sm font-medium text-primary opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
        Acessar módulo
        <ArrowRight className="ml-2 h-4 w-4" />
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

    const userModuleIds = user.permissions.map((p) => p.moduleId);

    return MODULE_CONFIGS.filter((module) => userModuleIds.includes(module.id));
  }, [user]);

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border/70 bg-card/80 backdrop-blur">
        <div className="container flex min-h-20 items-center justify-between gap-4 py-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Portal de Módulos
            </h1>

            {user && (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>
                  Olá,{" "}
                  <strong className="font-semibold text-foreground">
                    {user.nome}
                  </strong>
                </span>

                <span className="hidden text-border sm:inline">•</span>

                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  {user.role}
                </span>
              </div>
            )}
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
      </div>

      <section className="container py-10">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Workspace
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Módulos disponíveis
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Selecione um módulo para acessar suas funcionalidades e continuar
            sua operação dentro da plataforma.
          </p>
        </div>

        {availableModules.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {availableModules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Nenhum módulo disponível</CardTitle>
              <CardDescription>
                Você não tem permissão para acessar nenhum módulo no momento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Entre em contato com um administrador para revisar suas
                permissões.
              </p>
            </CardContent>
          </Card>
        )}
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
