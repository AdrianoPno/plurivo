"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import * as api from "@/lib/api";
import { useAuthStore } from "@/store/use-auth-store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const profileFormSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { user, setUser } = useAuthStore();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    // Popula o formulário com os dados do usuário do estado global
    values: {
      nome: user?.nome || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: api.updateMe,
    onSuccess: (updatedUser) => {
      toast.success("Perfil atualizado com sucesso!");
      // Atualiza o estado global com os novos dados do usuário
      setUser(updatedUser);
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
    <Card>
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>
          Atualize as informações do seu perfil. Seu e-mail não pode ser
          alterado.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <Input value={user?.email || ""} disabled />
            </FormItem>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
