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
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResearchCardSkeleton } from "@/components/ui/research-card-skeleton";
import { Separator } from "@/components/ui/separator";
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
      return <ImageIcon className="size-5" />;
    case "video":
      return <Video className="size-5" />;
    case "document":
      return <FileText className="size-5" />;
    default:
      return <LinkIcon className="size-5" />;
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
    <div className="flex gap-3 rounded-2xl border bg-background/60 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="text-sm font-medium text-foreground">{value}</div>
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
      <main className="space-y-8 p-6 md:p-10">
        <ResearchCardSkeleton />
      </main>
    );
  }

  if (isError || !research) {
    return (
      <main className="p-6 md:p-10">
        <div className="rounded-[28px] border border-destructive/20 bg-destructive/10 p-8 text-center">
          <h2 className="text-2xl font-bold text-destructive">
            Erro ao carregar a pesquisa
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            A descoberta que você está procurando não foi encontrada ou ocorreu
            um erro ao carregar os dados.
          </p>

          <Button asChild variant="outline" className="mt-6 rounded-2xl">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 size-4" />
              Voltar para a Biblioteca
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-8 p-6 md:p-10">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[hsl(var(--primary))] p-8 text-white shadow-2xl shadow-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_35%)]" />

        <div className="relative z-10 space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              asChild
              variant="ghost"
              className="w-fit rounded-2xl text-white/80 hover:bg-white/10 hover:text-white"
            >
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 size-4" />
                Biblioteca
              </Link>
            </Button>

            <Button
              onClick={() => setIsEditFormOpen(true)}
              className="w-full rounded-2xl bg-white text-[hsl(var(--primary))] hover:bg-white/90 sm:w-auto"
            >
              <Edit className="mr-2 size-4" />
              Editar pesquisa
            </Button>
          </div>

          <div className="max-w-4xl space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium",
                  getStatusStyles(research.status),
                )}
              >
                {statusLabels[research.status as ResearchStatus] ??
                  research.status}
              </Badge>

              <Badge className="rounded-full border-0 bg-white/10 px-3 py-1 text-white backdrop-blur-sm">
                {methodologyLabels[research.methodology] ??
                  research.methodology}
              </Badge>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                {research.title}
              </h1>

              <p className="max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
                {research.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card className="rounded-[28px] border-border/60 bg-card/80 shadow-sm">
            <CardHeader>
              <CardTitle>Objetivo principal</CardTitle>
              <CardDescription>
                O que esta pesquisa busca descobrir ou validar.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="leading-relaxed text-muted-foreground">
                {research.objective}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-border/60 bg-card/80 shadow-sm">
            <CardHeader>
              <CardTitle>Insights e conclusões</CardTitle>
              <CardDescription>
                Aprendizados, recomendações e resultados observados.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                {research.insights || "Nenhum insight registrado ainda."}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-border/60 bg-card/80 shadow-sm">
            <CardHeader>
              <CardTitle>Artefatos e evidências</CardTitle>
              <CardDescription>
                Links, documentos, protótipos e materiais relacionados.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {research.artifacts && research.artifacts.length > 0 ? (
                <div className="grid gap-3">
                  {research.artifacts.map((artifact, index) => (
                    <a
                      key={`${artifact.url}-${index}`}
                      href={artifact.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-2xl border bg-background/60 p-4 transition-all hover:-translate-y-0.5 hover:bg-muted/60 hover:shadow-sm"
                    >
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <ArtifactIcon type={artifact.type} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {artifact.name || artifact.url}
                        </p>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {artifact.type || "Link externo"}
                        </p>
                      </div>

                      <ExternalLink className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed bg-muted/30 p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Nenhum artefato adicionado a esta pesquisa.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="rounded-[28px] border-border/60 bg-card/80 shadow-sm">
            <CardHeader>
              <CardTitle>Planejamento</CardTitle>
              <CardDescription>
                Datas, custos e contexto operacional.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
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

          <Card className="rounded-[28px] border-border/60 bg-card/80 shadow-sm">
            <CardHeader>
              <CardTitle>Contexto</CardTitle>
              <CardDescription>
                Público, localização e classificação.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
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

              <div className="rounded-2xl border bg-background/60 p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Tag className="size-4" />
                  Tags
                </div>

                <div className="flex flex-wrap gap-2">
                  {research.tags?.length ? (
                    research.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="rounded-full"
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

      <CreateResearchForm
        open={isEditFormOpen}
        onOpenChange={setIsEditFormOpen}
        initialData={research}
        onSuccess={() => setIsEditFormOpen(false)}
      />
    </main>
  );
}
