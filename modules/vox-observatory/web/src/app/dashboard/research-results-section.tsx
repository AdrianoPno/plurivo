"use client";

import { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import { Input } from "@shared/ui/input";
import { Textarea } from "@shared/ui/textarea";
import { FormValues } from "./create-research-form";

interface ResearchResultsSectionProps {
  control: Control<FormValues>;
  isDisabled: boolean;
}

export function ResearchResultsSection({
  control,
  isDisabled,
}: ResearchResultsSectionProps) {
  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-base font-semibold">Resultados e encerramento</h3>
        <p className="text-sm text-muted-foreground">
          Registre os valores reais para comparar planejamento e execução.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField
          control={control}
          name="actualEndDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data real de término</FormLabel>

              <FormControl>
                <Input
                  type="date"
                  disabled={isDisabled}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="actualCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custo real (R$)</FormLabel>

              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0,00"
                  disabled={isDisabled}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    field.onChange(event.target.value);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>

              <FormDescription>
                Use para comparar com o custo estimado.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="insights"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Insights finais</FormLabel>

              <FormControl>
                <Textarea
                  className="min-h-32 resize-none"
                  placeholder="Documente aprendizados, resultados, recomendações e impactos da pesquisa."
                  disabled={isDisabled}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>

              <FormDescription>
                Essas informações ajudam na análise histórica e tomada de
                decisão.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}
