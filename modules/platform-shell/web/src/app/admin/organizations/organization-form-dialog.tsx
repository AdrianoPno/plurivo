"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Palette } from "lucide-react";

import { MODULE_CONFIGS } from "@shared/constants/modules";
import {
  DEFAULT_TENANT_THEME,
  TENANT_THEME_PRESETS,
  type TenantThemePreset,
} from "@shared/design/tenant-themes";
import type { CreateTenantInput, Tenant } from "@shared/types/tenant";
import { Button } from "@shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { cn } from "@shared/utils/cn";

interface OrganizationFormDialogProps {
  open: boolean;
  organization?: Tenant | null;
  onOpenChange(open: boolean): void;
  onSubmit(data: CreateTenantInput): Promise<unknown>;
}

const emptyForm: CreateTenantInput = {
  slug: "",
  legalName: "",
  branding: { displayName: "", themePreset: DEFAULT_TENANT_THEME },
  activeModules: [],
  status: "ACTIVE",
};

export function OrganizationFormDialog({
  open,
  organization,
  onOpenChange,
  onSubmit,
}: OrganizationFormDialogProps) {
  const [form, setForm] = useState<CreateTenantInput>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      organization
        ? {
            slug: organization.slug,
            legalName: organization.legalName,
            branding: organization.branding,
            activeModules: organization.activeModules,
            status: organization.status,
          }
        : emptyForm,
    );
  }, [open, organization]);

  const theme = useMemo(
    () => TENANT_THEME_PRESETS[form.branding.themePreset],
    [form.branding.themePreset],
  );

  const toggleModule = (moduleId: (typeof MODULE_CONFIGS)[number]["id"]) => {
    setForm((current) => ({
      ...current,
      activeModules: current.activeModules.includes(moduleId)
        ? current.activeModules.filter((id) => id !== moduleId)
        : [...current.activeModules, moduleId],
    }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(form);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const valid =
    form.legalName.trim().length >= 2 &&
    form.branding.displayName.trim().length >= 2 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-3xl">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle>
            {organization ? "Editar organizacao" : "Nova organizacao"}
          </DialogTitle>
          <DialogDescription>
            Configure a identidade e os modulos disponiveis para este cliente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-7 px-6 py-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="legalName">Razao social ou nome juridico</Label>
              <Input
                id="legalName"
                value={form.legalName}
                onChange={(event) =>
                  setForm({ ...form, legalName: event.target.value })
                }
                placeholder="Instituto Exemplo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Nome exibido</Label>
              <Input
                id="displayName"
                value={form.branding.displayName}
                onChange={(event) =>
                  setForm({
                    ...form,
                    branding: {
                      ...form.branding,
                      displayName: event.target.value,
                    },
                  })
                }
                placeholder="Plataforma Exemplo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Identificador</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(event) =>
                  setForm({ ...form, slug: event.target.value.toLowerCase() })
                }
                placeholder="instituto-exemplo"
              />
            </div>
          </div>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Identidade visual</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(TENANT_THEME_PRESETS).map(([id, preset]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      branding: {
                        ...form.branding,
                        themePreset: id as TenantThemePreset,
                      },
                    })
                  }
                  className={cn(
                    "min-h-28 rounded-lg border bg-card p-4 text-left transition-colors",
                    form.branding.themePreset === id
                      ? "border-primary ring-2 ring-ring/30"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <span className="mb-3 flex gap-2">
                    <span className="h-5 w-5 rounded-full" style={{ background: `hsl(${preset.primary})` }} />
                    <span className="h-5 w-5 rounded-full" style={{ background: `hsl(${preset.accent})` }} />
                  </span>
                  <strong className="block text-sm">{preset.label}</strong>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    {preset.description}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold">Modulos contratados</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {MODULE_CONFIGS.map((module) => (
                <label key={module.id} className="flex cursor-pointer gap-3 rounded-lg border border-border p-4">
                  <input
                    type="checkbox"
                    checked={form.activeModules.includes(module.id)}
                    onChange={() => toggleModule(module.id)}
                    className="mt-1 h-4 w-4 accent-primary"
                  />
                  <span>
                    <strong className="block text-sm">{module.name}</strong>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">{module.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <div
            className="rounded-lg border p-5"
            style={
              {
                "--preview-primary": `hsl(${theme.primary})`,
                "--preview-accent": `hsl(${theme.accent})`,
              } as React.CSSProperties
            }
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--preview-primary)] text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{form.branding.displayName || "Nome da plataforma"}</p>
                <p className="text-sm text-muted-foreground">Pre-visualizacao da identidade</p>
              </div>
              <span className="ml-auto h-3 w-16 rounded-full bg-[var(--preview-accent)]" />
            </div>
          </div>

          <DialogFooter className="border-t border-border pt-5">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!valid || isSubmitting}>
              {isSubmitting ? "Salvando..." : organization ? "Salvar alteracoes" : "Criar organizacao"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
