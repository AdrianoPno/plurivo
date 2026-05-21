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
import { Button } from "@shared/ui/button";
import {
  FormValues,
  methodologyOptions,
  statusOptions,
} from "./create-research-form";

interface ResearchPlanningSectionProps {
  control: Control<FormValues>;
  isDisabled: boolean;
}

export function ResearchPlanningSection({
  control,
  isDisabled,
}: ResearchPlanningSectionProps) {
  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-base font-semibold">
          Classificação e planejamento
        </h3>
        <p className="text-sm text-muted-foreground">
          Defina metodologia, status, datas e custos planejados.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField
          control={control}
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
                        field.value === option.value ? "default" : "outline"
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
          control={control}
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
                        field.value === option.value ? "default" : "outline"
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
          control={control}
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
          control={control}
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
          control={control}
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
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    // allow empty string for clearing the input
                    if (v === "") {
                      field.onChange(undefined);
                      return;
                    }
                    const num = Number(v);
                    field.onChange(Number.isNaN(num) ? undefined : num);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
              <FormDescription>Separe as tags por vírgula.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
}
