"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Calendar,
  DollarSign,
  Eye,
  Loader2,
  MapPin,
  PlusCircle,
  Search,
} from "lucide-react";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useInfiniteQuery } from "@tanstack/react-query";

import * as api from "@/lib/api";
import { ResearchCardSkeleton } from "@/components/ui/research-card-skeleton";
import { CreateResearchForm } from "./create-research-form";

import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shared/ui/card";
import { Input } from "@shared/ui/input";
import { Separator } from "@shared/ui/separator";
import { cn } from "@shared/utils/cn";

type ResearchStatus = "em_andamento" | "concluida" | "pausada";

const statusLabels: Record<ResearchStatus, string> = {
  em_andamento: "Em andamento",
  concluida: "Concluída",
  pausada: "Pausada",
};

const methodologyLabels: Record<string, string> = {
  quantitativa: "Quantitativa",
  qualitativa: "Qualitativa",
  etnografica: "Etnográfica",
  teste_usabilidade: "Teste de usabilidade",
};

const statusFilterOptions: Array<{
  label: string;
  value?: ResearchStatus;
}> = [
  { label: "Todos", value: undefined },
  { label: "Em andamento", value: "em_andamento" },
  { label: "Concluída", value: "concluida" },
  { label: "Pausada", value: "pausada" },
];

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatResearchDate(date: string | Date | null | undefined) {
  if (!date) return "Data indisponível";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data inválida";
  }

  return format(parsedDate, "dd MMM yyyy", {
    locale: ptBR,
  });
}

function formatCurrency(value?: number | null) {
  if (!value || value <= 0) return "N/A";

  return currencyFormatter.format(value);
}

function getStatusStyles(status: string) {
  if (status === "concluida") {
    return "border-transparent bg-[hsl(var(--status-completed-bg))] text-[hsl(var(--status-completed-fg))]";
  }

  if (status === "pausada") {
    return "border-transparent bg-[hsl(var(--status-paused-bg))] text-[hsl(var(--status-paused-fg))]";
  }

  return "border-transparent bg-[hsl(var(--status-ongoing-bg))] text-[hsl(var(--status-ongoing-fg))]";
}

export default function LibraryPage() {
  const [filters, setFilters] = useState<api.ListResearchesFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFilters((previousFilters) => ({
        ...previousFilters,
        title: searchTerm.trim() || undefined,
      }));
    }, 500);

    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  const {
    data,
    isLoading,
    isError,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["researches", filters],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      api.getResearches({
        ...filters,
        limit: 12,
        startAfter: pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const researches =
    data?.pages.flatMap((page) => page.data).filter(Boolean) ?? [];

  const showSkeleton = isLoading && !data;
  const hasResearches = researches.length > 0;

  if (showSkeleton) {
    return (
      <main className="space-y-10 bg-background p-6 text-foreground md:p-10">
        <div className="space-y-3">
          <div className="h-10 w-64 rounded-2xl bg-muted" />
          <div className="h-4 w-full max-w-lg rounded-xl bg-muted" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <ResearchCardSkeleton />
          <ResearchCardSkeleton />
          <ResearchCardSkeleton />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="bg-background p-6 text-foreground md:p-10">
        <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-8">
          <h1 className="text-xl font-semibold text-destructive">
            Falha ao carregar a biblioteca
          </h1>

          <p className="mt-3 max-w-lg text-sm text-muted-foreground">
            Não foi possível carregar as pesquisas no momento.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-10 bg-background p-6 text-foreground md:p-10">
      <section className="relative overflow-hidden rounded-[32px] border border-border bg-[hsl(var(--primary))] p-8 text-primary-foreground shadow-2xl shadow-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_35%)]" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl space-y-4">
            <Badge className="rounded-full border-0 bg-white/10 px-4 py-1 text-white backdrop-blur-sm">
              Research Intelligence Platform
            </Badge>

            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight">
                Biblioteca de Pesquisas
              </h1>

              <p className="text-base leading-relaxed text-white/75">
                Centralize pesquisas, descobertas e analises da organizacao em
                uma unica plataforma.
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsFormOpen(true)}
            size="lg"
            className="h-12 rounded-2xl bg-white text-[hsl(var(--primary))] shadow-sm hover:bg-white/90"
          >
            <PlusCircle className="mr-2 size-4" />
            Nova descoberta
          </Button>
        </div>
      </section>

      <section className="rounded-[28px] border border-border bg-card p-5 text-card-foreground shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex w-full max-w-2xl flex-col gap-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Buscar pesquisas..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-12 rounded-2xl border border-input bg-background pl-11 text-foreground shadow-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {statusFilterOptions.map((item) => {
                const isAllFilter = !item.value;
                const isActive = isAllFilter
                  ? !filters.status
                  : filters.status === item.value;

                return (
                  <Button
                    key={item.label}
                    size="sm"
                    variant={isActive ? "default" : "outline"}
                    className={cn(
                      "rounded-xl",
                      !isActive &&
                        "border-border bg-card text-card-foreground hover:bg-muted",
                    )}
                    onClick={() =>
                      setFilters((previousFilters) => ({
                        ...previousFilters,
                        status: item.value,
                      }))
                    }
                  >
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {!hasResearches ? (
        <section className="flex min-h-[320px] items-center justify-center rounded-[28px] border border-dashed border-border bg-card p-8 text-center text-card-foreground shadow-sm">
          <div className="max-w-md space-y-3">
            <h2 className="text-xl font-semibold">
              Nenhuma descoberta encontrada
            </h2>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Ajuste os filtros aplicados ou registre uma nova pesquisa para
              começar a construir a inteligência do observatório.
            </p>
          </div>
        </section>
      ) : (
        <section className="space-y-5">
          {isFetching && !isFetchingNextPage && (
            <p className="text-sm text-muted-foreground">
              Atualizando resultados...
            </p>
          )}

          <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
            {researches.map((research) => {
              const status = research.status as ResearchStatus;

              return (
                <Card
                  key={research.id}
                  className="group overflow-hidden rounded-[28px] border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/5"
                >
                  <CardHeader className="space-y-5 pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <Badge
                        className={cn(
                          "rounded-full px-3 py-1 text-[11px] font-medium",
                          getStatusStyles(research.status),
                        )}
                      >
                        {statusLabels[status] ?? research.status}
                      </Badge>

                      <span className="font-mono text-[10px] text-muted-foreground">
                        {research.id.slice(0, 8)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <CardTitle className="line-clamp-2 text-2xl leading-tight tracking-tight">
                        {research.title}
                      </CardTitle>

                      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {research.description}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="rounded-full border-border bg-background"
                      >
                        {methodologyLabels[research.methodology] ??
                          research.methodology}
                      </Badge>

                      {research.tags?.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="rounded-full px-2.5 py-1 text-[11px]"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <Separator className="opacity-50" />

                    <div className="grid gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 shrink-0" />
                        <span>{formatResearchDate(research.startDate)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 shrink-0" />
                        <span className="truncate">
                          {research.location || "Localização não informada"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <DollarSign className="size-4 shrink-0" />
                        <span>
                          Investimento estimado:{" "}
                          {formatCurrency(research.estimatedCost)}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2">
                    <Button asChild className="h-11 w-full rounded-2xl">
                      <Link href={`/dashboard/researches/${research.id}`}>
                        <Eye className="mr-2 size-4" />
                        Ver detalhes
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                size="lg"
                className="min-w-44 rounded-2xl"
              >
                {isFetchingNextPage && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}

                {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
              </Button>
            </div>
          )}
        </section>
      )}

      <CreateResearchForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={null}
        onSuccess={() => {
          setIsFormOpen(false);
        }}
      />
    </main>
  );
}
