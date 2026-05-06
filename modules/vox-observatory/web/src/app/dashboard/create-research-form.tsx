"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import * as api from "@/lib/api";

import { ResearchBasicInfoSection } from "./research-basic-info-section";
import { ResearchPlanningSection } from "./research-planning-section";
import { ResearchResultsSection } from "./research-results-section";
import { ResearchArtifactsSection } from "./research-artifacts-section";

import { Button } from "@shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Form } from "@shared/ui/form";
import { Separator } from "@shared/ui/separator";

export const methodologyOptions = [
  { value: "qualitativa", label: "Qualitativa" },
  { value: "quantitativa", label: "Quantitativa" },
  { value: "etnografica", label: "Etnográfica" },
  { value: "teste_usabilidade", label: "Teste de usabilidade" },
] as const;

export const statusOptions = [
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluida", label: "Concluída" },
  { value: "pausada", label: "Pausada" },
] as const;

const numberField = (message: string) => z.coerce.number().nonnegative(message);

const formSchema = z
  .object({
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

    status: z.enum(["em_andamento", "concluida", "pausada"]),

    startDate: z.string().min(1, "Data de início é obrigatória."),

    estimatedEndDate: z.string().min(1, "Data de término é obrigatória."),

    actualEndDate: z.string().optional(),

    targetAudience: z.string().min(1, "O público-alvo é obrigatório."),

    location: z.string().min(1, "A localização é obrigatória."),

    estimatedCost: numberField("O custo estimado deve ser positivo."),

    actualCost: numberField("O custo real deve ser positivo."),

    tags: z.string().min(1, "Adicione pelo menos uma tag."),

    insights: z.string().optional(),

    artifacts: z
      .array(
        z.object({
          url: z.string().url("Insira uma URL válida."),
          name: z.string().min(1, "O nome do artefato é obrigatório."),
          type: z.string().optional(),
        }),
      )
      .optional(),
  })
  .refine(
    (data) => new Date(data.estimatedEndDate) > new Date(data.startDate),
    {
      message: "A data de término estimada deve ser posterior ao início.",
      path: ["estimatedEndDate"],
    },
  )
  .refine(
    (data) =>
      !data.actualEndDate ||
      new Date(data.actualEndDate) >= new Date(data.startDate),
    {
      message: "A data real de término deve ser igual ou posterior ao início.",
      path: ["actualEndDate"],
    },
  );

export type FormValues = z.input<typeof formSchema>;

export type FormSubmitValues = z.output<typeof formSchema>;

interface CreateResearchFormProps {
  onSuccess?: () => void;
  initialData?: api.Research | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultValues: FormValues = {
  title: "",
  description: "",
  objective: "",
  methodology: "qualitativa",
  status: "em_andamento",
  startDate: new Date().toISOString().split("T")[0],
  estimatedEndDate: "",
  actualEndDate: "",
  targetAudience: "",
  location: "",
  estimatedCost: 0,
  actualCost: 0,
  tags: "",
  insights: "",
  artifacts: [],
};

function formatDateToInputValue(date?: string | Date | null) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().split("T")[0];
}

function dateInputToISOString(date: string) {
  return new Date(`${date}T00:00:00.000Z`).toISOString();
}

export function CreateResearchForm({
  onSuccess,
  initialData,
  open,
  onOpenChange,
}: CreateResearchFormProps) {
  const queryClient = useQueryClient();

  const isEditMode = Boolean(initialData);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues, unknown, FormSubmitValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      form.reset({
        title: initialData.title ?? "",
        description: initialData.description ?? "",
        objective: initialData.objective ?? "",
        methodology: initialData.methodology ?? "qualitativa",
        status: initialData.status ?? "em_andamento",
        startDate: formatDateToInputValue(initialData.startDate),
        estimatedEndDate: formatDateToInputValue(initialData.estimatedEndDate),
        actualEndDate: formatDateToInputValue(initialData.actualEndDate),
        targetAudience: initialData.targetAudience ?? "",
        location: initialData.location ?? "",
        estimatedCost: initialData.estimatedCost ?? 0,
        actualCost: initialData.actualCost ?? 0,
        tags: initialData.tags?.join(", ") ?? "",
        insights: initialData.insights ?? "",
        artifacts: initialData.artifacts ?? [],
      });

      return;
    }

    form.reset(defaultValues);
  }, [open, initialData, form]);

  const createMutation = useMutation({
    mutationFn: api.createResearch,
    onSuccess: () => {
      toast.success("Descoberta criada com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["researches"] });
      onSuccess?.();
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Não foi possível criar a descoberta. Tente novamente.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: api.updateResearch,
    onSuccess: () => {
      toast.success("Descoberta atualizada com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["researches"] });
      onSuccess?.();
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Não foi possível atualizar a descoberta. Tente novamente.");
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isDisabled = isSubmitting || isUploading;

  function onSubmit(values: FormSubmitValues) {
    const data = {
      title: values.title,
      description: values.description,
      objective: values.objective,
      methodology: values.methodology,
      status: values.status,
      startDate: dateInputToISOString(values.startDate),
      estimatedEndDate: dateInputToISOString(values.estimatedEndDate),
      actualEndDate: values.actualEndDate
        ? dateInputToISOString(values.actualEndDate)
        : null,
      targetAudience: values.targetAudience,
      location: values.location,
      estimatedCost: values.estimatedCost,
      actualCost: values.actualCost,
      insights: values.insights?.trim() || undefined,
      tags: values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      artifacts: values.artifacts ?? [],
    };

    if (isEditMode && initialData) {
      updateMutation.mutate({
        id: initialData.id,
        data,
      });

      return;
    }

    createMutation.mutate(data);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90dvh] max-h-[90dvh] max-w-4xl p-0">
        <DialogHeader className="shrink-0 border-b border-border bg-card px-6 py-5">
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            {isEditMode ? "Editar descoberta" : "Registrar nova descoberta"}
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            {isEditMode
              ? "Atualize as informações da descoberta selecionada."
              : "Preencha os dados principais para registrar uma nova descoberta na biblioteca."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="research-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col bg-card text-card-foreground"
          >
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-card px-6 py-6">
              <div className="space-y-8">
                <ResearchBasicInfoSection
                  control={form.control}
                  isDisabled={isDisabled}
                />

                <Separator />

                <ResearchPlanningSection
                  control={form.control}
                  isDisabled={isDisabled}
                />

                {isEditMode && (
                  <>
                    <Separator />

                    <ResearchResultsSection
                      control={form.control}
                      isDisabled={isDisabled}
                    />
                  </>
                )}

                <Separator />

                <ResearchArtifactsSection
                  control={form.control}
                  isDisabled={isSubmitting}
                  onUploadingChange={setIsUploading}
                />
              </div>
            </div>

            <DialogFooter className="shrink-0 border-t border-border bg-card px-6 py-4">
              <Button
                type="button"
                variant="ghost"
                disabled={isDisabled}
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={isDisabled} className="min-w-40">
                {isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {isEditMode ? "Salvar alterações" : "Criar descoberta"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
