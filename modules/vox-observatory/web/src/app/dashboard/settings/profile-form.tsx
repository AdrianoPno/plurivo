"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  BadgeCheck,
  Fingerprint,
  Loader2,
  Mail,
  Palette,
  ShieldCheck,
  User,
} from "lucide-react";

import * as api from "@/lib/api";
import { useAuth } from "@shared/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import { Input } from "@shared/ui/input";
import { Separator } from "@shared/ui/separator";

const profileFormSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const roleLabels: Record<string, string> = {
  ADMIN: "Administrador",
  VIEWER: "Visualizador",
  SUPER: "Super usuário",
};

const statusLabels: Record<string, string> = {
  ativo: "Ativo",
  inativo: "Inativo",
};

export function ProfileForm() {
  const { user } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    values: {
      nome: user?.nome || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: api.updateMe,
    onSuccess: (updatedUser) => {
      toast.success("Perfil atualizado com sucesso.");
      form.reset({ nome: updatedUser.nome });
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
      toast.error("Falha ao atualizar o perfil. Tente novamente.");
    },
  });

  function onSubmit(data: ProfileFormValues) {
    updateProfileMutation.mutate(data);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Card className="rounded-[28px] border-border/60 bg-card/80 shadow-sm">
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>
            Atualize suas informações básicas de identificação.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="Seu nome completo"
                            className="h-11 rounded-2xl pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={user?.email || ""}
                      disabled
                      className="h-11 rounded-2xl pl-9"
                    />
                  </div>
                </FormItem>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="h-11 rounded-2xl"
                >
                  {updateProfileMutation.isPending && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  Salvar alterações
                </Button>
              </div>
            </CardContent>
          </form>
        </Form>
      </Card>

      <div className="space-y-6">
        <Card className="rounded-[28px] border-border/60 bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle>Conta</CardTitle>
            <CardDescription>
              Informações de acesso e permissões atuais.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="rounded-2xl border bg-background/60 p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Permissão</p>
                  <p className="text-sm font-medium">
                    {roleLabels[user?.role ?? ""] ??
                      user?.role ??
                      "Não informado"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-background/60 p-4">
              <div className="flex items-center gap-3">
                <BadgeCheck className="size-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge className="mt-1 rounded-full">
                    {statusLabels[user?.status ?? ""] ??
                      user?.status ??
                      "Não informado"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-background/60 p-4">
              <div className="flex items-center gap-3">
                <Fingerprint className="size-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Identificador</p>
                  <p className="break-all font-mono text-xs">
                    {user?.uid ?? "Não informado"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-border/60 bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle>Preferências</CardTitle>
            <CardDescription>
              Espaço reservado para personalizações futuras.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-2xl border border-dashed bg-muted/30 p-5">
              <div className="flex items-start gap-3">
                <Palette className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Tema e aparência</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Futuramente você poderá ajustar tema, densidade visual e
                    preferências da biblioteca por aqui.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
