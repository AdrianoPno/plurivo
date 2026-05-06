"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Edit,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  MapPin,
  Target,
  Tag,
  Video,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import * as api from "@/lib/api";
import { cn } from "@shared/utils/cn";

import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/card";
import { ResearchCardSkeleton } from "@/components/ui/research-card-skeleton";
import { CreateResearchForm } from "@/app/dashboard/create-research-form";

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

function formatDate(date?: string | Date | null) {
  if (!date) return "Não informado";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data inválida";
  }

  return format(parsedDate, "dd MMM yyyy", {
    locale: ptBR,
  });
}

function formatCurrency(value?: number | null) {
  if (!value || value <= 0) return "Não informado";

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

function ArtifactIcon({ type }: { type?: string }) {
  switch (type) {
    case "image":
      return <ImageIcon className="size-4" />;
    case "video":
      return <Video className="size-4" />;
    case "document":
      return <FileText className="size-4" />;
    default:
      return <LinkIcon className="size-4" />;
  }
}

function MetadataItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-muted/35 p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 space-y-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <div className="text-sm font-semibold leading-snug text-foreground">
          {value}
        </div>
      </div>
    </div>
  );
}

export default function ResearchDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const {
    data: research,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["research", id],
    queryFn: () => api.getResearchById(id),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <main className="bg-background p-4 text-foreground md:p-6">
        <div className="mx-auto max-w-7xl">
          <ResearchCardSkeleton />
        </div>
      </main>
    );
  }

  if (isError || !research) {
    return (
      <main className="bg-background p-4 text-foreground md:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center">
            <h2 className="text-xl font-bold text-destructive">
              Erro ao carregar a pesquisa
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              A descoberta que você está procurando não foi encontrada ou
              ocorreu um erro ao carregar os dados.
            </p>

            <Button asChild variant="outline" className="mt-5 rounded-xl">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 size-4" />
                Voltar para a Biblioteca
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background p-4 text-foreground md:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[hsl(var(--primary))] p-5 text-white shadow-sm md:p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_35%)]" />

          <div className="relative z-10 space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-9 w-fit rounded-lg px-3 text-white/80 hover:bg-white/10 hover:text-white"
              >
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 size-4" />
                  Biblioteca
                </Link>
              </Button>

              <Button
                onClick={() => setIsEditFormOpen(true)}
                size="sm"
                className="h-9 w-full rounded-lg bg-white px-3 text-[hsl(var(--primary))] hover:bg-white/90 sm:w-auto"
              >
                <Edit className="mr-2 size-4" />
                Editar pesquisa
              </Button>
            </div>

            <div className="max-w-4xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-medium",
                    getStatusStyles(research.status),
                  )}
                >
                  {statusLabels[research.status as ResearchStatus] ??
                    research.status}
                </Badge>

                <Badge className="rounded-full border-0 bg-white/10 px-3 py-1 text-[11px] text-white backdrop-blur-sm">
                  {methodologyLabels[research.methodology] ??
                    research.methodology}
                </Badge>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  {research.title}
                </h1>

                <p className="max-w-3xl text-sm leading-relaxed text-white/75">
                  {research.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <Card className="rounded-2xl border-border bg-card shadow-sm">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-lg">Objetivo principal</CardTitle>
                <CardDescription>
                  O que esta pesquisa busca descobrir ou validar.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0">
                <p className="max-w-5xl text-sm leading-relaxed text-muted-foreground">
                  {research.objective}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card shadow-sm">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-lg">Insights e conclusões</CardTitle>
                <CardDescription>
                  Aprendizados, recomendações e resultados observados.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0">
                <p className="max-w-5xl whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {research.insights || "Nenhum insight registrado ainda."}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card shadow-sm">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-lg">
                  Artefatos e evidências
                </CardTitle>
                <CardDescription>
                  Links, documentos, protótipos e materiais relacionados.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0">
                {research.artifacts && research.artifacts.length > 0 ? (
                  <div className="grid gap-3">
                    {research.artifacts.map((artifact, index) => (
                      <a
                        key={`${artifact.url}-${index}`}
                        href={artifact.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-xl border border-border bg-muted/35 p-3 transition-all hover:-translate-y-0.5 hover:bg-muted hover:shadow-sm"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <ArtifactIcon type={artifact.type} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">
                            {artifact.name || artifact.url}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {artifact.type || "Link externo"}
                          </p>
                        </div>

                        <ExternalLink className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Nenhum artefato adicionado a esta pesquisa.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-5 xl:sticky xl:top-6">
            <Card className="rounded-2xl border-border bg-card shadow-sm">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-lg">Planejamento</CardTitle>
                <CardDescription>
                  Datas, custos e contexto operacional.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 p-5 pt-0">
                <MetadataItem
                  icon={Calendar}
                  label="Início"
                  value={formatDate(research.startDate)}
                />

                <MetadataItem
                  icon={Calendar}
                  label="Término estimado"
                  value={formatDate(research.estimatedEndDate)}
                />

                <MetadataItem
                  icon={Calendar}
                  label="Término real"
                  value={formatDate(research.actualEndDate)}
                />

                <MetadataItem
                  icon={DollarSign}
                  label="Custo estimado"
                  value={formatCurrency(research.estimatedCost)}
                />

                <MetadataItem
                  icon={DollarSign}
                  label="Custo real"
                  value={formatCurrency(research.actualCost)}
                />
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border bg-card shadow-sm">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-lg">Contexto</CardTitle>
                <CardDescription>
                  Público, localização e classificação.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 p-5 pt-0">
                <MetadataItem
                  icon={Target}
                  label="Público-alvo"
                  value={research.targetAudience}
                />

                <MetadataItem
                  icon={MapPin}
                  label="Localização"
                  value={research.location}
                />

                <div className="rounded-xl border border-border bg-muted/35 p-3">
                  <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <Tag className="size-4" />
                    Tags
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {research.tags?.length ? (
                      research.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="rounded-full text-[11px]"
                        >
                          #{tag}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Nenhuma tag cadastrada.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </section>
      </div>

      <CreateResearchForm
        open={isEditFormOpen}
        onOpenChange={setIsEditFormOpen}
        initialData={research}
        onSuccess={() => setIsEditFormOpen(false)}
      />
    </main>
  );
}
