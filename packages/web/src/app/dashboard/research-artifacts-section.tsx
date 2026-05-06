"use client";

import { useEffect, useRef, useState } from "react";
import { Control, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, UploadCloud } from "lucide-react";

import { uploadFileToStorage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues } from "./create-research-form";

interface ResearchArtifactsSectionProps {
  control: Control<FormValues>;
  isDisabled: boolean; // isSubmitting from parent
  onUploadingChange: (isUploading: boolean) => void;
}

export function ResearchArtifactsSection({
  control,
  isDisabled,
  onUploadingChange,
}: ResearchArtifactsSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    fields: artifactFields,
    append: appendArtifact,
    remove: removeArtifact,
  } = useFieldArray({
    control,
    name: "artifacts",
  });

  useEffect(() => {
    onUploadingChange(isUploading);
  }, [isUploading, onUploadingChange]);

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
      if (event.target) {
        event.target.value = "";
      }
    }
  }

  const isSectionDisabled = isDisabled || isUploading;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold">Artefatos e evidências</h3>
          <p className="text-sm text-muted-foreground">
            Adicione links, documentos, protótipos, vídeos ou relatórios
            relacionados.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSectionDisabled}
            onClick={() => appendArtifact({ url: "", name: "", type: "link" })}
          >
            <Plus className="mr-2 size-4" />
            Adicionar link
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isSectionDisabled}
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
            disabled={isSectionDisabled}
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
                control={control}
                name={`artifacts.${index}.url`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase text-muted-foreground">
                      URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://..."
                        disabled={isSectionDisabled}
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
                control={control}
                name={`artifacts.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase text-muted-foreground">
                      Nome
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Protótipo Figma"
                        disabled={isSectionDisabled}
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
                  disabled={isSectionDisabled}
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
  );
}
