"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  ListChecks,
  Loader,
  PauseCircle,
  Package,
} from "lucide-react";

import * as api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusDistributionChart } from "./status-distribution-chart";
import { CostPerResearchChart } from "./cost-per-research-chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  const {
    data: paginatedData,
    isLoading,
    isError,
  } = useQuery({
    // Usamos uma chave de query diferente para não conflitar com a listagem paginada
    queryKey: ["researches-for-analytics"],
    // Para analytics, buscamos um limite alto para simular "todos os dados".
    // Uma solução ideal a longo prazo seria um endpoint de API dedicado.
    queryFn: () => api.getResearches({ limit: 999 }),
  });

  const [dateRange, setDateRange] = useState<{
    from?: string;
    to?: string;
  }>({});

  function handleClearFilters() {
    setDateRange({});
  }

  const researches = paginatedData?.data ?? [];

  const filteredResearches = useMemo(() => {
    if (!researches) return [];

    return researches.filter((research) => {
      const researchDate = new Date(research.createdAt);
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;

      // Adjust fromDate to the start of the day in UTC
      if (fromDate) fromDate.setUTCHours(0, 0, 0, 0);

      // Adjust toDate to the end of the day in UTC
      if (toDate) toDate.setUTCHours(23, 59, 59, 999);

      if (fromDate && researchDate < fromDate) return false;
      if (toDate && researchDate > toDate) return false;
      return true;
    });
  }, [researches, dateRange]);

  const analyticsData = useMemo(() => {
    if (!filteredResearches || filteredResearches.length === 0) {
      return {
        totalResearches: 0,
        statusCounts: {
          em_andamento: 0,
          concluida: 0,
          pausada: 0,
        },
        totalEstimatedCost: 0,
        averageCost: 0,
      };
    }

    const statusCounts = filteredResearches.reduce(
      (acc, research) => {
        acc[research.status] = (acc[research.status] || 0) + 1;
        return acc;
      },
      { em_andamento: 0, concluida: 0, pausada: 0 } as Record<
        api.Research["status"],
        number
      >,
    );

    const totalEstimatedCost = filteredResearches.reduce(
      (acc, research) => acc + research.estimatedCost,
      0,
    );

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

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Métricas e insights sobre suas pesquisas.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent className="flex items-center justify-center pt-6">
              <Skeleton className="h-48 w-48 rounded-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent className="pt-6">
              <Skeleton className="h-[192px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-8 text-destructive">
        Falha ao carregar os dados de analytics.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Métricas e insights sobre suas pesquisas.
        </p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="grid gap-2">
            <Label htmlFor="date-from">De</Label>
            <Input
              id="date-from"
              type="date"
              value={dateRange.from || ""}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, from: e.target.value }))
              }
              className="w-full sm:w-[200px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date-to">Até</Label>
            <Input
              id="date-to"
              type="date"
              value={dateRange.to || ""}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, to: e.target.value }))
              }
              className="w-full sm:w-[200px]"
            />
          </div>
          {(dateRange.from || dateRange.to) && (
            <Button variant="ghost" onClick={handleClearFilters}>
              Limpar
            </Button>
          )}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.totalResearches}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Loader className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.statusCounts.em_andamento}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.statusCounts.concluida}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pausadas</CardTitle>
            <PauseCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.statusCounts.pausada}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Custo Total Estimado
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(analyticsData.totalEstimatedCost)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Custo Médio por Pesquisa
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(analyticsData.averageCost)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <StatusDistributionChart data={analyticsData.statusCounts} />
        <CostPerResearchChart researches={filteredResearches} />
      </div>
    </div>
  );
}
