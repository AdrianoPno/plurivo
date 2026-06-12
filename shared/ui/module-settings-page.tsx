"use client";

import type { ElementType } from "react";
import {
  BadgeCheck,
  ExternalLink,
  Fingerprint,
  Info,
  KeyRound,
  LockKeyhole,
  Mail,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  User,
} from "lucide-react";

import { MODULE_URLS, type ModuleId } from "@shared/constants/modules";
import type { IUser, UserRole } from "@shared/types/user";
import { cn } from "@shared/lib/utils";

import { Badge } from "./badge";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Separator } from "./separator";

type SettingAction = {
  label: string;
  href: string;
  description: string;
  icon: ElementType;
};

type SettingInfo = {
  label: string;
  value: string;
};

type ModuleSettingsPageProps = {
  user: IUser | null;
  moduleId: ModuleId;
  moduleName: string;
  moduleDescription: string;
  moduleIcon: ElementType;
  moduleApiUrl: string;
  accessDescription: string;
  permissionCapabilities: Partial<Record<UserRole, string[]>>;
  preferences: SettingInfo[];
  adminActions: SettingAction[];
  className?: string;
};

const roleLabels: Record<UserRole, string> = {
  SUPER: "Super usuario",
  ADMIN: "Administrador",
  USER: "Usuario",
  VIEWER: "Visualizador",
};

function getModuleRole(user: IUser | null, moduleId: ModuleId): UserRole {
  if (!user) return "VIEWER";

  if (user.role === "SUPER") {
    return "SUPER";
  }

  return (
    user.permissions.find((permission) => permission.moduleId === moduleId)
      ?.role ?? "VIEWER"
  );
}

function getStatusLabel(user: IUser | null) {
  if (!user) return "Nao informado";

  if (user.ativo === false || user.status === "inativo") {
    return "Inativo";
  }

  return "Ativo";
}

function InfoTile({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: ElementType;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p
            className={cn(
              "mt-1 break-words text-sm font-semibold text-foreground",
              mono && "font-mono text-xs",
            )}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ModuleSettingsPage({
  user,
  moduleId,
  moduleName,
  moduleDescription,
  moduleIcon: ModuleIcon,
  moduleApiUrl,
  accessDescription,
  permissionCapabilities,
  preferences,
  adminActions,
  className,
}: ModuleSettingsPageProps) {
  const moduleRole = getModuleRole(user, moduleId);
  const capabilities = permissionCapabilities[moduleRole] ?? [];
  const canSeeAdminActions =
    user?.role === "SUPER" || moduleRole === "ADMIN" || user?.role === "ADMIN";

  return (
    <div className={cn("space-y-8", className)}>
      <section className="relative overflow-hidden rounded-[32px] border border-border bg-card p-8 text-card-foreground shadow-sm">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_28rem),radial-gradient(circle_at_top_right,hsl(var(--accent)/0.12),transparent_24rem)]" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Settings className="size-3.5" />
              Configuracoes
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
              {moduleName}
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {moduleDescription}
            </p>
          </div>

          <div className="flex size-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-sm">
            <ModuleIcon className="size-7" />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Conta</CardTitle>
              <CardDescription>
                Informacoes de acesso usadas pelo login central da plataforma.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <InfoTile
                  icon={User}
                  label="Nome"
                  value={user?.nome ?? "Nao informado"}
                />
                <InfoTile
                  icon={Mail}
                  label="E-mail"
                  value={user?.email ?? "Nao informado"}
                />
                <InfoTile
                  icon={BadgeCheck}
                  label="Status"
                  value={getStatusLabel(user)}
                />
                <InfoTile
                  icon={Fingerprint}
                  label="Identificador"
                  value={user?.uid ?? "Nao informado"}
                  mono
                />
              </div>

              <Separator />

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <a href={`${MODULE_URLS.platformShell.web}/account`}>
                    <KeyRound className="mr-2 size-4" />
                    Alterar senha na Platform
                  </a>
                </Button>

                <Button asChild variant="outline">
                  <a href={MODULE_URLS.platformShell.web}>
                    <ExternalLink className="mr-2 size-4" />
                    Voltar para Platform
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Acesso neste modulo</CardTitle>
              <CardDescription>{accessDescription}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <InfoTile
                  icon={ShieldCheck}
                  label="Permissao no modulo"
                  value={roleLabels[moduleRole]}
                />
                <InfoTile
                  icon={LockKeyhole}
                  label="Role global"
                  value={user?.role ? roleLabels[user.role] : "Nao informado"}
                />
              </div>

              {user?.unidadeNome || user?.unidadeId ? (
                <InfoTile
                  icon={Info}
                  label="Unidade vinculada"
                  value={user.unidadeNome ?? user.unidadeId ?? "Nao informado"}
                />
              ) : null}

              <div className="rounded-2xl border border-border/70 bg-muted/30 p-5">
                <p className="text-sm font-semibold text-foreground">
                  O que esta permissao permite
                </p>

                {capabilities.length > 0 ? (
                  <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
                    {capabilities.map((capability) => (
                      <li key={capability} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{capability}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Nenhuma permissao operacional foi encontrada para este
                    modulo.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Preferencias</CardTitle>
              <CardDescription>
                Padroes de uso aplicados atualmente neste modulo.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {preferences.map((preference) => (
                <div
                  key={preference.label}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-border/70 bg-background/60 p-4"
                >
                  <div className="flex items-start gap-3">
                    <SlidersHorizontal className="mt-0.5 size-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {preference.label}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {preference.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Administracao</CardTitle>
              <CardDescription>
                Atalhos de configuracao disponiveis conforme seu acesso.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {canSeeAdminActions && adminActions.length > 0 ? (
                adminActions.map((action) => (
                  <Button
                    key={action.href}
                    asChild
                    variant="outline"
                    className="h-auto w-full justify-start whitespace-normal rounded-2xl p-4 text-left"
                  >
                    <a href={action.href}>
                      <action.icon className="mr-3 size-5 shrink-0 text-primary" />
                      <span>
                        <span className="block font-semibold">
                          {action.label}
                        </span>
                        <span className="mt-1 block text-xs font-normal text-muted-foreground">
                          {action.description}
                        </span>
                      </span>
                    </a>
                  </Button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-5">
                  <p className="text-sm font-medium text-foreground">
                    Nenhum atalho administrativo disponivel.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Seu acesso atual permite usar o modulo, mas nao alterar
                    configuracoes administrativas.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Sobre</CardTitle>
              <CardDescription>
                Informacoes uteis para suporte e validacao de ambiente.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/60 p-4">
                <span className="text-sm text-muted-foreground">Ambiente</span>
                <Badge variant="secondary">
                  {process.env.NODE_ENV === "production"
                    ? "Producao"
                    : "Desenvolvimento"}
                </Badge>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
                <p className="text-sm text-muted-foreground">API conectada</p>
                <p className="mt-2 break-all font-mono text-xs text-foreground">
                  {moduleApiUrl}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
