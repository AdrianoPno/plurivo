"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, KeyRound, Mail, ShieldCheck, User } from "lucide-react";
import * as z from "zod";

import { MODULE_CONFIGS } from "@shared/constants/modules";
import type { IUser, ModulePermission } from "@shared/types/user.js";
import type { Tenant } from "@shared/types/tenant.js";
import { Button } from "@shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import { Input } from "@shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";

const moduleIdSchema = z.enum(["coop-manager", "vox-observatory"]);
const moduleRoleSchema = z.enum(["ADMIN", "USER", "VIEWER"]);
const globalRoleSchema = z.enum(["SUPER", "ADMIN", "USER"]);

const userFormSchema = z
  .object({
    nome: z.string().min(2, "O nome e obrigatorio."),
    email: z.string().email("Informe um e-mail valido."),
    password: z.string().optional(),
    role: globalRoleSchema,
    tenantId: z.string().optional(),
    permissions: z.array(
      z.object({
        moduleId: moduleIdSchema,
        role: moduleRoleSchema,
      }),
    ),
    isEditing: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.isEditing && (!data.password || data.password.length < 6)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "A senha provisoria deve ter no minimo 6 caracteres.",
      });
    }
    if (data.role !== "SUPER" && !data.tenantId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["tenantId"],
        message: "Selecione a organizacao do usuario.",
      });
    }
  });

export type UserFormData = z.infer<typeof userFormSchema>;

type ModulePermissionRole = ModulePermission["role"];
type ModuleRoleSelectValue = ModulePermissionRole | "NO_ACCESS";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: IUser | null;
  tenants: Tenant[];
  isSuper: boolean;
  defaultTenantId?: string;
  onSubmit: (data: UserFormData) => Promise<void>;
}

export function UserFormDialog({
  open,
  onOpenChange,
  initialData,
  tenants,
  isSuper,
  defaultTenantId,
  onSubmit,
}: UserFormDialogProps) {
  const isEditing = !!initialData;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      nome: "",
      email: "",
      password: "",
      role: "USER",
      tenantId: defaultTenantId || "",
      permissions: [],
      isEditing: false,
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      nome: initialData?.nome || "",
      email: initialData?.email || "",
      password: "",
      role:
        initialData?.role === "SUPER" ||
        initialData?.role === "ADMIN" ||
        initialData?.role === "USER"
          ? initialData.role
          : "USER",
      permissions: initialData?.permissions || [],
      tenantId: initialData?.tenantId || defaultTenantId || "",
      isEditing,
    });
  }, [defaultTenantId, form, initialData, isEditing, open]);

  const selectedPermissions = form.watch("permissions");
  const selectedRole = form.watch("role");
  const selectedTenantId = form.watch("tenantId");
  const isSubmitting = form.formState.isSubmitting;
  const availableModules =
    tenants.find((tenant) => tenant.id === selectedTenantId)?.activeModules ??
    MODULE_CONFIGS.map((module) => module.id);

  const getModuleRole = (
    moduleId: ModulePermission["moduleId"],
  ): ModuleRoleSelectValue =>
    selectedPermissions.find((permission) => permission.moduleId === moduleId)
      ?.role || "NO_ACCESS";

  const setModuleRole = (
    moduleId: ModulePermission["moduleId"],
    value: ModuleRoleSelectValue,
  ) => {
    const nextPermissions = selectedPermissions.filter(
      (permission) => permission.moduleId !== moduleId,
    );

    if (value !== "NO_ACCESS") {
      nextPermissions.push({ moduleId, role: value });
    }

    form.setValue("permissions", nextPermissions, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleSubmit = async (data: UserFormData) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden border-border/70 p-0 shadow-2xl sm:max-w-[640px]">
        <DialogHeader className="border-b border-border/70 bg-muted/40 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              {isEditing ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
            </div>

            <div>
              <DialogTitle className="text-xl">
                {isEditing ? "Editar usuario" : "Criar novo usuario"}
              </DialogTitle>

              <DialogDescription className="mt-1">
                {isEditing
                  ? "Atualize as informacoes e permissoes deste usuario."
                  : "Preencha os dados para cadastrar um novo acesso."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="max-h-[calc(90vh-7rem)] overflow-y-auto px-6 py-6"
          >
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Nome do usuario"
                          className="pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isSuper && selectedRole !== "SUPER" && (
                <FormField
                  control={form.control}
                  name="tenantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organizacao</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const tenant = tenants.find((item) => item.id === value);
                          form.setValue(
                            "permissions",
                            selectedPermissions.filter((permission) =>
                              tenant?.activeModules.includes(permission.moduleId),
                            ),
                          );
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Selecione a organizacao" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tenants.filter((tenant) => tenant.status === "ACTIVE").map((tenant) => (
                            <SelectItem key={tenant.id} value={tenant.id}>
                              {tenant.branding.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="email@empresa.com.br"
                          className="pl-9"
                          disabled={isEditing}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isEditing && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha provisoria</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Minimo de 6 caracteres"
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permissao global</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma permissao" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        {isSuper && <SelectItem value="ADMIN">Admin</SelectItem>}
                        {isSuper && <SelectItem value="SUPER">Super</SelectItem>}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedRole !== "SUPER" && (
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldCheck className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-card-foreground">
                      Permissoes por modulo
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Defina o que este usuario pode acessar dentro de cada
                      modulo da plataforma.
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {MODULE_CONFIGS.filter((module) => availableModules.includes(module.id)).map((module) => (
                    <div
                      key={module.id}
                      className="flex flex-col gap-3 rounded-xl border border-border/70 bg-background/70 p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {module.name}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {module.description}
                        </p>
                      </div>

                      <Select
                        value={getModuleRole(module.id)}
                        onValueChange={(value) =>
                          setModuleRole(
                            module.id,
                            value as ModuleRoleSelectValue,
                          )
                        }
                      >
                        <SelectTrigger className="w-full sm:w-40">
                          <SelectValue placeholder="Sem acesso" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="NO_ACCESS">Sem acesso</SelectItem>
                          <SelectItem value="VIEWER">Viewer</SelectItem>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>

            <DialogFooter className="mt-8 gap-2 border-t border-border/70 pt-5 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Salvando..."
                  : isEditing
                    ? "Salvar alteracoes"
                    : "Criar usuario"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
