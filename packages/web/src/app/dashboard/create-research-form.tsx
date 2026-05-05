"use client";

import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, UploadCloud } from "lucide-react";

import * as api from "@/lib/api";
import { uploadFileToStorage } from "@/lib/storage";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const methodologyOptions = [
  { value: "qualitativa", label: "Qualitativa" },
  { value: "quantitativa", label: "Quantitativa" },
  { value: "etnografica", label: "Etnográfica" },
  { value: "teste_usabilidade", label: "Teste de usabilidade" },
] as const;

const statusOptions = [
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluida", label: "Concluída" },
  { value: "pausada", label: "Pausada" },
] as const;

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
    startDate: z.string().min(1, "Data de início é obrigatória."),
    estimatedEndDate: z.string().min(1, "Data de término é obrigatória."),
    status: z
      .enum(["em_andamento", "concluida", "pausada"])
      .default("em_andamento"),
    targetAudience: z.string().min(1, "O público-alvo é obrigatório."),
    location: z.string().min(1, "A localização é obrigatória."),
    estimatedCost: z.coerce
      .number()
      .nonnegative("O custo deve ser um valor positivo."),
    tags: z.string().min(1, "Adicione pelo menos uma tag."),
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
      message: "A data de término deve ser posterior ao início.",
      path: ["estimatedEndDate"],
    },
  );

type FormValues = z.infer<typeof formSchema>;

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
  targetAudience: "",
  location: "",
  estimatedCost: 0,
  tags: "",
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = Boolean(initialData);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    fields: artifactFields,
    append: appendArtifact,
    remove: removeArtifact,
  } = useFieldArray({
    control: form.control,
    name: "artifacts",
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
        targetAudience: initialData.targetAudience ?? "",
        location: initialData.location ?? "",
        estimatedCost: initialData.estimatedCost ?? 0,
        tags: initialData.tags?.join(", ") ?? "",
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

  function onSubmit(values: FormValues) {
    const data = {
      ...values,
      startDate: dateInputToISOString(values.startDate),
      estimatedEndDate: dateInputToISOString(values.estimatedEndDate),
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

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setIsUploading(true);

    try {
      const { downloadURL } = await uploadFileToStorage(file, "researches");

      appendArtifact({
        url: downloadURL,
        name: file.name,
        type: file.type || "file",
      });

      toast.success(`Arquivo "${file.name}" enviado com sucesso.`);
    } catch {
      toast.error("Falha no upload do arquivo. Tente novamente.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden p-0">
        <DialogHeader className="border-b bg-muted/30 px-6 py-5">
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            {isEditMode ? "Editar descoberta" : "Registrar nova descoberta"}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto px-6 py-6">
          <Form {...form}>
            <form
              id="research-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <section className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold">
                    Informações principais
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Dados básicos para identificar e contextualizar a pesquisa.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Pesquisa sobre jornada de compra"
                            disabled={isDisabled}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-28 resize-none"
                            placeholder="Descreva brevemente o contexto da descoberta."
                            disabled={isDisabled}
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
                      <FormItem className="md:col-span-2">
                        <FormLabel>Objetivo principal</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-24 resize-none"
                            placeholder="Explique o que essa pesquisa busca descobrir."
                            disabled={isDisabled}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <Separator />

              <section className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold">
                    Classificação e planejamento
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Defina metodologia, datas, custo e informações operacionais.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="methodology"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Metodologia</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {methodologyOptions.map((option) => (
                              <Button
                                key={option.value}
                                type="button"
                                size="sm"
                                disabled={isDisabled}
                                variant={
                                  field.value === option.value
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => field.onChange(option.value)}
                              >
                                {option.label}
                              </Button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {statusOptions.map((option) => (
                              <Button
                                key={option.value}
                                type="button"
                                size="sm"
                                disabled={isDisabled}
                                variant={
                                  field.value === option.value
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => field.onChange(option.value)}
                              >
                                {option.label}
                              </Button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de início</FormLabel>
                        <FormControl>
                          <Input type="date" disabled={isDisabled} {...field} />
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
                        <FormLabel>Término estimado</FormLabel>
                        <FormControl>
                          <Input type="date" disabled={isDisabled} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Público-alvo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Usuários mobile"
                            disabled={isDisabled}
                            {...field}
                          />
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
                          <Input
                            placeholder="Ex: Brasil / Remoto"
                            disabled={isDisabled}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estimatedCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custo estimado (R$)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="0,00"
                            disabled={isDisabled}
                            {...field}
                          />
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
                          <Input
                            placeholder="ux, pesquisa, mobile"
                            disabled={isDisabled}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Separe as tags por vírgula.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <Separator />

              <section className="space-y-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold">
                      Artefatos e evidências
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Adicione links, documentos, protótipos, vídeos ou
                      relatórios relacionados.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isDisabled}
                      onClick={() =>
                        appendArtifact({ url: "", name: "", type: "link" })
                      }
                    >
                      <Plus className="mr-2 size-4" />
                      Adicionar link
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={isDisabled}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isUploading ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <UploadCloud className="mr-2 size-4" />
                      )}
                      Upload
                    </Button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>
                </div>

                {artifactFields.length === 0 ? (
                  <div className="rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                    Nenhum artefato adicionado até o momento.
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {artifactFields.map((item, index) => (
                      <div
                        key={item.id}
                        className="grid gap-3 rounded-xl border bg-card p-4 shadow-sm md:grid-cols-[1fr_1fr_auto]"
                      >
                        <FormField
                          control={form.control}
                          name={`artifacts.${index}.url`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs uppercase text-muted-foreground">
                                URL
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://..."
                                  disabled={isDisabled}
                                  readOnly={field.value?.startsWith(
                                    "https://firebasestorage",
                                  )}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`artifacts.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs uppercase text-muted-foreground">
                                Nome
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ex: Protótipo Figma"
                                  disabled={isDisabled}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={isDisabled}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => removeArtifact(index)}
                            aria-label="Remover artefato"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </form>
          </Form>
        </div>

        <DialogFooter className="border-t bg-muted/30 px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            disabled={isDisabled}
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            form="research-form"
            disabled={isDisabled}
            className="min-w-40"
          >
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isEditMode ? "Salvar alterações" : "Criar descoberta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
