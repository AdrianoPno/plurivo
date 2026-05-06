"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  DollarSign,
  Eye,
  MapPin,
  PlusCircle,
  Search,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useInfiniteQuery } from "@tanstack/react-query";

import * as api from "@/lib/api";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResearchCardSkeleton } from "@/components/ui/research-card-skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { CreateResearchForm } from "./create-research-form";

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

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatResearchDate(date: string | Date) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data inválida";
  }

  return format(parsedDate, "dd MMM yyyy", {
    locale: ptBR,
  });
}

function formatCurrency(value?: number | null) {
  if (!value || value <= 0) {
    return "N/A";
  }

  return currencyFormatter.format(value);
}

function getStatusBadgeVariant(status: string) {
  if (status === "concluida") {
    return "default";
  }

  if (status === "pausada") {
    return "outline";
  }

  return "secondary";
}

export default function LibraryPage() {
  const [filters, setFilters] = useState<api.ListResearchesFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedResearch, setSelectedResearch] = useState<api.Research | null>(
    null,
  );

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
    queryFn: ({ pageParam }) =>
      api.getResearches({ ...filters, startAfter: pageParam }),
    // A asserção de tipo aqui é crucial para guiar a inferência de tipo do TypeScript.
    // Ela informa ao `useInfiniteQuery` que o `pageParam` pode ser uma string ou indefinido.
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  // Achata os resultados de todas as páginas em um único array para renderização
  // O .filter(Boolean) é uma medida de segurança para remover quaisquer itens
  // nulos ou indefinidos que possam vir da API, prevenindo o crash na renderização.
  const researches =
    data?.pages.flatMap((page) => page.data).filter(Boolean) ?? [];

  const showSkeleton = isLoading && !data;
  const hasResearches = researches.length > 0;

  function handleOpenCreateForm() {
    setSelectedResearch(null);
    setIsFormOpen(true);
  }

  if (showSkeleton) {
    return (
      <main className="container mx-auto space-y-8 p-4 md:p-8">
        <section className="space-y-3">
          <div className="h-8 w-48 rounded-md bg-muted" />
          <div className="h-4 w-full max-w-md rounded-md bg-muted" />
        </section>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ResearchCardSkeleton />
          <ResearchCardSkeleton />
          <ResearchCardSkeleton />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="container mx-auto p-4 md:p-8">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6">
          <h1 className="text-lg font-semibold text-destructive">
            Falha ao carregar a biblioteca
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Não foi possível buscar as descobertas no momento. Verifique sua
            conexão e tente novamente.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto space-y-8 p-4 md:p-8">
      <header className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Biblioteca</h1>
          <p className="max-w-2xl text-muted-foreground">
            Repositório central de pesquisas e descobertas do Vox Observatory.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full flex-col gap-3 lg:max-w-3xl">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar pelo título..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-10 pl-9"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={filters.status ? "outline" : "default"}
                onClick={() =>
                  setFilters((previousFilters) => ({
                    ...previousFilters,
                    status: undefined,
                  }))
                }
              >
                Todos
              </Button>

              <Button
                type="button"
                size="sm"
                variant={
                  filters.status === "em_andamento" ? "default" : "outline"
                }
                onClick={() =>
                  setFilters((previousFilters) => ({
                    ...previousFilters,
                    status: "em_andamento",
                  }))
                }
              >
                Em andamento
              </Button>

              <Button
                type="button"
                size="sm"
                variant={filters.status === "concluida" ? "default" : "outline"}
                onClick={() =>
                  setFilters((previousFilters) => ({
                    ...previousFilters,
                    status: "concluida",
                  }))
                }
              >
                Concluída
              </Button>

              <Button
                type="button"
                size="sm"
                variant={filters.status === "pausada" ? "default" : "outline"}
                onClick={() =>
                  setFilters((previousFilters) => ({
                    ...previousFilters,
                    status: "pausada",
                  }))
                }
              >
                Pausada
              </Button>
            </div>
          </div>

          <Button
            onClick={handleOpenCreateForm}
            className="h-10 w-full sm:w-auto"
          >
            <PlusCircle className="mr-2 size-4" />
            Nova descoberta
          </Button>
        </div>
      </header>

      {!hasResearches ? (
        <section className="flex min-h-72 items-center justify-center rounded-xl border border-dashed bg-muted/30 p-8 text-center">
          <div className="max-w-sm space-y-2">
            <h2 className="text-lg font-semibold">
              Nenhuma descoberta encontrada
            </h2>
            <p className="text-sm text-muted-foreground">
              Ajuste os filtros aplicados ou registre uma nova descoberta para
              começar a montar a biblioteca.
            </p>
          </div>
        </section>
      ) : (
        <section className="space-y-3">
          {isFetching && (
            <p className="text-sm text-muted-foreground">
              Atualizando resultados...
            </p>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {researches.map((research) => (
              <Card
                key={research.id}
                className="flex flex-col border-muted transition-shadow hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <Badge
                      variant={getStatusBadgeVariant(research.status)}
                      className="whitespace-nowrap"
                    >
                      {statusLabels[research.status as ResearchStatus] ??
                        research.status}
                    </Badge>

                    <span className="font-mono text-[10px] text-muted-foreground">
                      ID: {research.id.slice(0, 8)}
                    </span>
                  </div>

                  <CardTitle className="line-clamp-2 text-xl leading-tight">
                    {research.title}
                  </CardTitle>

                  <CardDescription className="mt-2 line-clamp-2">
                    {research.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className="bg-primary/5">
                      {methodologyLabels[research.methodology] ??
                        research.methodology}
                    </Badge>

                    {research.tags?.slice(0, 4).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[10px] font-normal"
                      >
                        #{tag}
                      </Badge>
                    ))}

                    {research.tags && research.tags.length > 4 && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-normal"
                      >
                        +{research.tags.length - 4}
                      </Badge>
                    )}
                  </div>

                  <Separator className="opacity-50" />

                  <div className="grid grid-cols-1 gap-3 text-xs text-muted-foreground sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3.5 shrink-0" />
                      <span>{formatResearchDate(research.startDate)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="size-3.5 shrink-0" />
                      <span className="truncate">{research.location}</span>
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-2">
                      <DollarSign className="size-3.5 shrink-0" />
                      <span>
                        Investimento: {formatCurrency(research.estimatedCost)}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="px-6 pb-6 pt-0">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="group w-full"
                  >
                    <Link href={`/dashboard/researches/${research.id}`}>
                      <Eye className="mr-2 size-3.5 transition-colors group-hover:text-primary" />
                      Ver detalhes
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="min-w-40"
              >
                {isFetchingNextPage ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : null}
                {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
              </Button>
            </div>
          )}
        </section>
      )}

      <CreateResearchForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={selectedResearch}
        onSuccess={() => {
          setSelectedResearch(null);
          setIsFormOpen(false);
        }}
      />
    </main>
  );
}
