"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Edit, Calendar, DollarSign, Target } from "lucide-react";
import * as api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResearchCardSkeleton } from "@/components/ui/research-card-skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CreateResearchForm } from "./create-research-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function LibraryPage() {
  const [filters, setFilters] = useState<api.ListResearchesFilters>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce para a busca por título
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, title: searchTerm || undefined }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedResearch, setSelectedResearch] = useState<api.Research | null>(
    null,
  );

  const {
    data: researches = [],
    isLoading,
    isError,
  } = useQuery<api.Research[]>({
    queryKey: ["researches", filters],
    queryFn: () => api.getResearches(filters),
    placeholderData: (previousData) => previousData,
  });

  function handleOpenCreateForm() {
    setSelectedResearch(null);
    setIsFormOpen(true);
  }

  function handleOpenEditForm(research: api.Research) {
    setSelectedResearch(research);
    setIsFormOpen(true);
  }

  const showSkeleton = isLoading && researches.length === 0;

  if (showSkeleton) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ResearchCardSkeleton />
          <ResearchCardSkeleton />
          <ResearchCardSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-8 text-destructive font-medium">
        ⚠️ Falha ao carregar a biblioteca de descobertas. Verifique sua conexão.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Biblioteca</h1>
          <p className="text-muted-foreground">
            Repositório central de pesquisas e descobertas do Vox Observatory.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 w-full sm:flex-row sm:w-auto">
            <Input
              placeholder="Buscar pelo título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80"
            />
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => {
                setFilters((prev) => ({
                  ...prev,
                  status: value === "all" ? undefined : (value as any),
                }));
              }}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="pausada">Pausada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleOpenCreateForm} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Descoberta
          </Button>
        </div>
      </header>

      {researches.length === 0 && !isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed bg-muted/30">
          <p className="text-muted-foreground text-sm">
            Nenhuma descoberta encontrada para os filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {researches.map((research) => (
            <Card
              key={research.id}
              className="flex flex-col hover:shadow-md transition-shadow border-muted"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge
                    variant={
                      research.status === "concluida" ? "default" : "secondary"
                    }
                    className="capitalize"
                  >
                    {research.status.replace("_", " ")}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    ID: {research.id.substring(0, 8)}
                  </span>
                </div>
                <CardTitle className="text-xl leading-tight">
                  {research.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  {research.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="bg-primary/5">
                    {research.methodology}
                  </Badge>
                  {research.tags?.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[10px] font-normal"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <Separator className="opacity-50" />

                <div className="grid grid-cols-2 gap-y-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {format(new Date(research.startDate), "dd MMM yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3" />
                    <span className="truncate">{research.location}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <DollarSign className="h-3 w-3" />
                    <span>
                      Investimento:{" "}
                      {research.estimatedCost > 0
                        ? `R$ ${research.estimatedCost.toLocaleString()}`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0 pb-6 px-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group"
                  onClick={() => handleOpenEditForm(research)}
                >
                  <Edit className="mr-2 h-3.5 w-3.5 group-hover:text-primary transition-colors" />
                  Gerenciar Detalhes
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <CreateResearchForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={selectedResearch}
        onSuccess={() => {
          setIsFormOpen(false);
          // Opcional: toast de sucesso aqui
        }}
      />
    </div>
  );
}
