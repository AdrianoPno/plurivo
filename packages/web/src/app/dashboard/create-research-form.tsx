"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),
  description: z
    .string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres."),
  objective: z.string().min(1, "O objetivo é obrigatório."),
  methodology: z.enum([
    "quantitativa",
    "qualitativa",
    "etnografica",
    "teste_usabilidade",
  ]),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  estimatedEndDate: z.string().min(1, "Data de término é obrigatória"),
  targetAudience: z.string().min(1, "O público-alvo é obrigatório."),
  location: z.string().min(1, "A localização é obrigatória."),
  estimatedCost: z.coerce
    .number()
    .nonnegative("O custo deve ser um valor positivo."),
  tags: z.string().min(1, "Adicione pelo menos uma tag."),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateResearchFormProps {
  onSuccess?: () => void;
  initialData?: api.Research | null;
  // New props to control the AlertDialog
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateResearchForm({
  onSuccess,
  initialData,
  open,
  onOpenChange,
}: CreateResearchFormProps) {
  const isEditMode = !!initialData;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      objective: "",
      methodology: "qualitativa",
      startDate: new Date().toISOString().split("T")[0],
      estimatedEndDate: "",
      targetAudience: "",
      location: "",
      estimatedCost: 0,
      tags: "",
    },
  });

  const queryClient = useQueryClient();

  // Popula o formulário com dados iniciais no modo de edição
  useEffect(() => {
    if (isEditMode && initialData) {
      form.reset({
        ...initialData,
        startDate: new Date(initialData.startDate).toISOString().split("T")[0],
        estimatedEndDate: new Date(initialData.estimatedEndDate)
          .toISOString()
          .split("T")[0],
        tags: initialData.tags.join(", "),
      });
    } else {
      // Garante que o formulário seja limpo ao alternar de edição para criação
      form.reset();
    }
  }, [initialData, isEditMode, form]);

  const createResearchMutation = useMutation({
    mutationFn: api.createResearch,
    onSuccess: () => {
      toast.success("Nova descoberta criada com sucesso!");
      form.reset();
      // Invalida a query de listagem para que ela seja recarregada com os novos dados
      queryClient.invalidateQueries({ queryKey: ["researches"] });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to create research:", error);
      toast.error("Falha ao criar descoberta. Tente novamente.");
    },
  });

  const updateResearchMutation = useMutation({
    mutationFn: api.updateResearch,
    onSuccess: () => {
      toast.success("Descoberta atualizada com sucesso!");
      // Não resetamos o form aqui para permitir edições contínuas,
      // o onSuccess do dialog irá fechá-lo.
      queryClient.invalidateQueries({ queryKey: ["researches"] });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to update research:", error);
      toast.error("Falha ao atualizar descoberta. Tente novamente.");
    },
  });

  function onSubmit(values: FormValues) {
    // Ajuste na tipagem para garantir compatibilidade com o que a API espera
    const dataToSubmit = {
      ...values,
      startDate: new Date(values.startDate).toISOString(),
      estimatedEndDate: new Date(values.estimatedEndDate).toISOString(),
      tags: values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      status: "em_andamento" as const,
    };

    if (isEditMode && initialData) {
      updateResearchMutation.mutate({
        id: initialData.id,
        data: dataToSubmit,
      });
    } else {
      createResearchMutation.mutate(dataToSubmit);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold">
            {isEditMode ? "Editar Descoberta" : "Registrar Nova Descoberta"}
          </AlertDialogTitle>
          {/* AlertDialogDescription is usually for critical alerts,
              but can be used for a brief intro if desired.
              For a form, it might be redundant or semantically off. */}
          {/* <AlertDialogDescription>
            Preencha os detalhes da sua pesquisa.
          </AlertDialogDescription> */}
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 p-1" // Removed max-h and overflow-y-auto as AlertDialogContent handles it
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título da sua descoberta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva a descoberta..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Qual o objetivo principal?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="methodology"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metodologia</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a metodologia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="quantitativa">Quantitativa</SelectItem>
                      <SelectItem value="qualitativa">Qualitativa</SelectItem>
                      <SelectItem value="etnografica">Etnográfica</SelectItem>
                      <SelectItem value="teste_usabilidade">
                        Teste de Usabilidade
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estimatedEndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Término (Estimada)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Público-Alvo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Usuários Mobile" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Remoto / Brasil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="estimatedCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custo Estimado</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="mobile, ux, fintech" {...field} />
                  </FormControl>
                  <FormDescription>Separe as tags por vírgula.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={
                  createResearchMutation.isPending ||
                  updateResearchMutation.isPending
                }
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={
                  createResearchMutation.isPending ||
                  updateResearchMutation.isPending
                }
              >
                {createResearchMutation.isPending ||
                updateResearchMutation.isPending
                  ? isEditMode
                    ? "Salvando..."
                    : "Criando..."
                  : isEditMode
                    ? "Salvar Alterações"
                    : "Criar Descoberta"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
