"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Building2, Pencil, Plus, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@shared/auth";
import { PrivateRoute } from "@shared/auth/private-route";
import { MODULE_CONFIGS } from "@shared/constants/modules";
import { TENANT_THEME_PRESETS } from "@shared/design/tenant-themes";
import type { CreateTenantInput, Tenant } from "@shared/types/tenant";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Card, CardContent } from "@shared/ui/card";
import { EmptyState } from "@shared/ui/empty-state";
import * as apiClient from "@/lib/api-client";
import { OrganizationFormDialog } from "./organization-form-dialog";

function OrganizationsContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tenant | null>(null);

  const organizations = useQuery({
    queryKey: ["tenants"],
    queryFn: apiClient.getTenants,
    enabled: user?.role === "SUPER",
  });

  const save = useMutation({
    mutationFn: (data: CreateTenantInput) =>
      editing
        ? apiClient.updateTenant({ id: editing.id, data })
        : apiClient.createTenant(data),
    onSuccess: () => {
      toast.success(editing ? "Organizacao atualizada." : "Organizacao criada.");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      setEditing(null);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (user?.role !== "SUPER") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <ShieldAlert className="mx-auto h-9 w-9 text-destructive" />
            <h1 className="mt-4 text-xl font-semibold">Acesso exclusivo da plataforma</h1>
            <p className="mt-2 text-sm text-muted-foreground">Somente o administrador global pode gerenciar organizacoes.</p>
            <Button asChild variant="outline" className="mt-6"><Link href="/">Voltar ao portal</Link></Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const items = organizations.data ?? [];

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-primary" />
            <div><h1 className="text-xl font-bold">Organizacoes</h1><p className="text-sm text-muted-foreground">Clientes e modulos contratados</p></div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline"><Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Link></Button>
            <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="mr-2 h-4 w-4" />Nova organizacao</Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_34rem),radial-gradient(circle_at_top_right,hsl(var(--accent)/0.12),transparent_30rem)]" />
        <div className="mx-auto max-w-7xl px-6 py-10">
          {organizations.isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando organizacoes...</p>
          ) : organizations.isError ? (
            <Card><CardContent className="p-6 text-sm text-destructive">Nao foi possivel carregar as organizacoes.</CardContent></Card>
          ) : items.length === 0 ? (
            <div>
              <EmptyState title="Nenhuma organizacao cadastrada" description="Cadastre o primeiro cliente para configurar sua identidade e seus modulos." />
              <div className="mt-4 flex justify-center">
                <Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" />Cadastrar organizacao</Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {items.map((tenant) => {
                const theme = TENANT_THEME_PRESETS[tenant.branding.themePreset];
                return (
                  <Card key={tenant.id} className="overflow-hidden rounded-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <span className="mt-1 h-10 w-2 rounded-full" style={{ background: `hsl(${theme.primary})` }} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-semibold">{tenant.branding.displayName}</h2>
                            <Badge variant={tenant.status === "ACTIVE" ? "default" : "secondary"}>{tenant.status === "ACTIVE" ? "Ativa" : "Inativa"}</Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{tenant.legalName} · {tenant.slug}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {tenant.activeModules.map((id) => <Badge key={id} variant="outline">{MODULE_CONFIGS.find((module) => module.id === id)?.name ?? id}</Badge>)}
                            {tenant.activeModules.length === 0 && <span className="text-xs text-muted-foreground">Nenhum modulo ativo</span>}
                          </div>
                        </div>
                        <Button size="icon" variant="outline" title="Editar organizacao" onClick={() => { setEditing(tenant); setOpen(true); }}><Pencil className="h-4 w-4" /><span className="sr-only">Editar</span></Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <OrganizationFormDialog open={open} organization={editing} onOpenChange={(value) => { setOpen(value); if (!value) setEditing(null); }} onSubmit={(data) => save.mutateAsync(data)} />
    </main>
  );
}

export default function OrganizationsPage() {
  return <PrivateRoute><OrganizationsContent /></PrivateRoute>;
}
