"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  DollarSign,
  ListChecks,
  Loader,
  PauseCircle,
  Package,
  X,
} from "lucide-react";

import * as api from "@/lib/api";

import { Button } from "@shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { CostPerResearchChart } from "./cost-per-research-chart";
import { StatusDistributionChart } from "./status-distribution-chart";
import { Skeleton } from "@shared/ui/skeleton";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  accentClassName,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  accentClassName: string;
}) {
  return (
    <Card className="overflow-hidden rounded-[28px] border-border/60 bg-card/80 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>

        <div
          className={`flex size-11 items-center justify-center rounded-2xl ${accentClassName}`}
        >
          <Icon className="size-5" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>(
    {},
  );

  const {
    data: paginatedData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["researches-for-analytics"],
    queryFn: () => api.getResearches({ limit: 50 }),
  });

  const researches = paginatedData?.data ?? [];

  const filteredResearches = useMemo(() => {
    return researches.filter((research) => {
      const researchDate = new Date(research.createdAt ?? "");

      if (Number.isNaN(researchDate.getTime())) {
        return false;
      }

      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;

      if (fromDate) fromDate.setUTCHours(0, 0, 0, 0);
      if (toDate) toDate.setUTCHours(23, 59, 59, 999);

      if (fromDate && researchDate < fromDate) return false;
      if (toDate && researchDate > toDate) return false;

      return true;
    });
  }, [researches, dateRange]);

  const analyticsData = useMemo(() => {
    const statusCounts: Record<api.ResearchStatus, number> = {
      em_andamento: 0,
      concluida: 0,
      pausada: 0,
    };

    const totalEstimatedCost = filteredResearches.reduce((acc, research) => {
      return acc + (research.estimatedCost ?? 0);
    }, 0);

    filteredResearches.forEach((research) => {
      statusCounts[research.status] += 1;
    });

    const totalResearches = filteredResearches.length;
    const averageCost =
      totalResearches > 0 ? totalEstimatedCost / totalResearches : 0;

    return {
      totalResearches,
      statusCounts,
      totalEstimatedCost,
      averageCost,
    };
  }, [filteredResearches]);

  function handleClearFilters() {
    setDateRange({});
  }

  if (isLoading) {
    return (
      <main className="space-y-8 p-6 md:p-10">
        <section className="rounded-[32px] border bg-card/70 p-8 shadow-sm">
          <Skeleton className="h-10 w-64 rounded-2xl" />
          <Skeleton className="mt-4 h-4 w-full max-w-lg rounded-xl" />
        </section>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="rounded-[28px]">
              <CardHeader>
                <Skeleton className="h-4 w-28" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="rounded-[28px]">
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full rounded-2xl" />
            </CardContent>
          </Card>

          <Card className="rounded-[28px]">
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full rounded-2xl" />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="p-6 md:p-10">
        <div className="rounded-[28px] border border-destructive/20 bg-destructive/10 p-8">
          <h1 className="text-xl font-semibold text-destructive">
            Falha ao carregar analytics
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Não foi possível buscar os dados analíticos no momento.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-8 p-6 md:p-10">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[hsl(var(--primary))] p-8 text-white shadow-2xl shadow-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_35%)]" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm backdrop-blur-sm">
              <BarChart3 className="size-4" />
              Analytics
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight">
                Inteligência operacional
              </h1>
              <p className="text-base leading-relaxed text-white/75">
                Acompanhe volume, status e investimento das pesquisas
                Observatory.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-sm text-white/70">Pesquisas analisadas</p>
            <p className="mt-1 text-3xl font-bold">
              {analyticsData.totalResearches}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border bg-card/70 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="grid gap-2">
            <Label htmlFor="date-from">De</Label>
            <Input
              id="date-from"
              type="date"
              value={dateRange.from || ""}
              onChange={(event) =>
                setDateRange((previous) => ({
                  ...previous,
                  from: event.target.value,
                }))
              }
              className="h-11 rounded-2xl bg-muted/70 sm:w-[220px]"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date-to">Até</Label>
            <Input
              id="date-to"
              type="date"
              value={dateRange.to || ""}
              onChange={(event) =>
                setDateRange((previous) => ({
                  ...previous,
                  to: event.target.value,
                }))
              }
              className="h-11 rounded-2xl bg-muted/70 sm:w-[220px]"
            />
          </div>

          {(dateRange.from || dateRange.to) && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleClearFilters}
              className="h-11 rounded-2xl"
            >
              <X className="mr-2 size-4" />
              Limpar filtros
            </Button>
          )}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total"
          value={analyticsData.totalResearches}
          description="Pesquisas no período"
          icon={Package}
          accentClassName="bg-primary/10 text-primary"
        />

        <MetricCard
          title="Em andamento"
          value={analyticsData.statusCounts.em_andamento}
          description="Pesquisas ativas"
          icon={Loader}
          accentClassName="bg-[hsl(var(--status-ongoing-bg))]/10 text-[hsl(var(--status-ongoing-bg))]"
        />

        <MetricCard
          title="Concluídas"
          value={analyticsData.statusCounts.concluida}
          description="Pesquisas finalizadas"
          icon={ListChecks}
          accentClassName="bg-[hsl(var(--status-completed-bg))]/10 text-[hsl(var(--status-completed-bg))]"
        />

        <MetricCard
          title="Pausadas"
          value={analyticsData.statusCounts.pausada}
          description="Pesquisas interrompidas"
          icon={PauseCircle}
          accentClassName="bg-[hsl(var(--status-paused-bg))] text-[hsl(var(--status-paused-fg))]"
        />
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <MetricCard
          title="Custo total estimado"
          value={formatCurrency(analyticsData.totalEstimatedCost)}
          description="Investimento planejado"
          icon={DollarSign}
          accentClassName="bg-[hsl(var(--highlight))]/30 text-[hsl(var(--highlight-foreground))]"
        />

        <MetricCard
          title="Custo médio"
          value={formatCurrency(analyticsData.averageCost)}
          description="Média por pesquisa"
          icon={DollarSign}
          accentClassName="bg-accent text-accent-foreground"
        />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <StatusDistributionChart data={analyticsData.statusCounts} />
        <CostPerResearchChart researches={filteredResearches} />
      </section>
    </main>
  );
}
