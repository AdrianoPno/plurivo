"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  Link as LinkIcon,
  MapPin,
  Target,
  Tag,
  Image as ImageIcon,
  Video,
  Edit,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

import * as api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreateResearchForm } from "@/app/dashboard/create-research-form";
import { ResearchCardSkeleton } from "@/components/ui/research-card-skeleton";

// Helper para renderizar ícones de artefatos
const ArtifactIcon = ({ type }: { type?: string }) => {
  switch (type) {
    case "image":
      return <ImageIcon className="h-5 w-5 text-muted-foreground" />;
    case "video":
      return <Video className="h-5 w-5 text-muted-foreground" />;
    case "document":
      return <FileText className="h-5 w-5 text-muted-foreground" />;
    default:
      return <LinkIcon className="h-5 w-5 text-muted-foreground" />;
  }
};

export default function ResearchDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const {
    data: research,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["research", id],
    queryFn: () => api.getResearchById(id),
    enabled: !!id, // Só executa a query se o ID existir
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <ResearchCardSkeleton />
      </div>
    );
  }

  if (isError || !research) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold text-destructive">
          Erro ao carregar a pesquisa
        </h2>
        <p className="text-muted-foreground mt-2">
          A descoberta que você está procurando não foi encontrada ou ocorreu um
          erro.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a Biblioteca
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      {/* Cabeçalho */}
      <header className="space-y-2">
        <Button asChild variant="ghost" className="-ml-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a Biblioteca
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditFormOpen(true)}
        >
          <Edit className="mr-2 h-4 w-4" /> Editar Pesquisa
        </Button>
        <Badge
          variant={research.status === "concluida" ? "default" : "secondary"}
          className="capitalize text-sm"
        >
          {research.status.replace("_", " ")}
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight">{research.title}</h1>
        <p className="text-lg text-muted-foreground">{research.description}</p>
      </header>

      <Separator />

      {/* Corpo Principal */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna de Detalhes */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Objetivo Principal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{research.objective}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Insights e Conclusões</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {research.insights || "Nenhum insight registrado ainda."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Artefatos e Evidências</CardTitle>
              <CardDescription>
                Links, documentos e mídias relacionadas a esta pesquisa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {research.artifacts && research.artifacts.length > 0 ? (
                <ul className="space-y-3">
                  {research.artifacts.map((artifact, index) => (
                    <li key={index}>
                      <a
                        href={artifact.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors"
                      >
                        <ArtifactIcon type={artifact.type} />
                        <div className="flex-1">
                          <p className="font-medium text-primary truncate">
                            {artifact.name || artifact.url}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {artifact.type || "Link"}
                          </p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum artefato adicionado a esta pesquisa.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna de Metadados */}
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metadados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <strong>Início:</strong>{" "}
                  {format(new Date(research.startDate), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <strong>Término (Estimado):</strong>{" "}
                  {format(new Date(research.estimatedEndDate), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <strong>Custo Estimado:</strong> R${" "}
                  {research.estimatedCost.toLocaleString("pt-BR")}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <strong>Público-alvo:</strong> {research.targetAudience}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <strong>Localização:</strong> {research.location}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Tag className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex flex-wrap gap-1.5">
                  {research.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </main>

      <CreateResearchForm
        open={isEditFormOpen}
        onOpenChange={setIsEditFormOpen}
        initialData={research}
        onSuccess={() => setIsEditFormOpen(false)}
      />
    </div>
  );
}
