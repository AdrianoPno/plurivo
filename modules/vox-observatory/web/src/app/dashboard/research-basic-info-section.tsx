"use client";

import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import { Input } from "@shared/ui/input";
import { Textarea } from "@shared/ui/textarea";
import { FormValues } from "./create-research-form";

interface ResearchBasicInfoSectionProps {
  control: Control<FormValues>;
  isDisabled: boolean;
}

export function ResearchBasicInfoSection({
  control,
  isDisabled,
}: ResearchBasicInfoSectionProps) {
  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-base font-semibold">Informações principais</h3>
        <p className="text-sm text-muted-foreground">
          Dados básicos para identificar e contextualizar a pesquisa.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
  );
}
