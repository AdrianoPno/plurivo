"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Plus, ShieldAlert, Users } from "lucide-react";

import { PrivateRoute } from "@shared/auth/private-route.js";
import { useAuth } from "@shared/auth/auth-context.js";
import { IUser } from "@shared/types/user.js";
import * as apiClient from "@/lib/api-client";

import { Button } from "@shared/ui/button";
import { DataTable } from "@shared/ui/data-table";
import { Card, CardContent } from "@shared/ui/card";

import { getColumns } from "../columns";
import { UserFormDialog, type UserFormData } from "./user-form-dialog.js";

function UsersPageContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);

  const { data: usersList = [], isLoading } = useQuery({
    queryKey: ["users", user?.unidadeId],
    queryFn: apiClient.getUsers,
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: apiClient.deleteUser,
    onSuccess: () => {
      toast.success("Usuário excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Falha ao excluir usuário.");
    },
  });

  const createMutation = useMutation({
    mutationFn: apiClient.createUser,
    onSuccess: () => {
      toast.success("Usuario criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Falha ao criar usuario.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: apiClient.updateUser,
    onSuccess: () => {
      toast.success("Usuario atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Falha ao atualizar usuario.");
    },
  });

  const handleOpenForm = (userToEdit: IUser | null = null) => {
    setEditingUser(userToEdit);
    setIsFormOpen(true);
  };

  const handleDeleteUser = (userToDelete: IUser) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir ${userToDelete.nome}?`,
    );

    if (confirmed) {
      deleteMutation.mutate(userToDelete.uid);
    }
  };

  const handleSubmitUser = async (data: UserFormData) => {
    const { isEditing, password, email, ...baseData } = data;

    if (isEditing && editingUser) {
      await updateMutation.mutateAsync({
        id: editingUser.uid,
        data: baseData,
      });
      return;
    }

    await createMutation.mutateAsync({
      ...baseData,
      email,
      password,
    });
  };

  const columns = getColumns({
    onEdit: handleOpenForm,
    onDelete: handleDeleteUser,
  });

  if (user?.role !== "SUPER" && user?.role !== "ADMIN") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <Card className="max-w-md border-destructive/30">
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <h1 className="mt-5 text-xl font-semibold tracking-tight">
              Acesso negado
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Você não possui permissão para acessar o gerenciamento de
              usuários.
            </p>

            <Button asChild className="mt-6" variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o portal
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm md:flex">
              <Users className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Gerenciamento de Usuários
              </h1>

              <p className="mt-1.5 text-sm text-muted-foreground">
                Crie, edite e gerencie os acessos dos usuários da plataforma.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>

            <Button onClick={() => handleOpenForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Usuário
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_34rem),radial-gradient(circle_at_top_right,hsl(var(--accent)/0.12),transparent_30rem)]" />

        <div className="mx-auto max-w-7xl px-6 py-10 md:py-12">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm">
              <Users className="h-3.5 w-3.5" />
              Usuários
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Controle de acessos
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Consulte usuários cadastrados, altere permissões e mantenha o
              acesso aos módulos organizado.
            </p>
          </div>

          <Card className="overflow-hidden shadow-sm">
            <CardContent className="p-0">
              <DataTable
                columns={columns}
                data={usersList}
                isLoading={isLoading}
                filterColumn="nome"
                filterPlaceholder="Filtrar por nome..."
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <UserFormDialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);

          if (!open) {
            setEditingUser(null);
          }
        }}
        initialData={editingUser}
        onSubmit={handleSubmitUser}
      />
    </main>
  );
}

export default function UsersPage() {
  return (
    <PrivateRoute>
      <UsersPageContent />
    </PrivateRoute>
  );
}
