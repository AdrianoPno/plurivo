"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Edit } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateResearchForm } from "./create-research-form";

export default function LibraryPage() {
  const [filters, setFilters] = useState<api.ListResearchesFilters>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce para a busca por texto
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, title: searchTerm || undefined }));
    }, 500); // Atraso de 500ms

    return () => {
      clearTimeout(timer);
    };
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
    // Mantém os dados anteriores enquanto busca novos para uma UX mais suave
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ResearchCardSkeleton />
          <ResearchCardSkeleton />
          <ResearchCardSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-8 text-destructive">
        Falha ao carregar a biblioteca de descobertas.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Biblioteca</h1>
        <p className="text-muted-foreground">
          Explore todas as pesquisas já realizadas.
        </p>
        <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row">
            <Input
              placeholder="Buscar pelo título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-xs"
            />
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => {
                setFilters((prev) => ({
                  ...prev,
                  status:
                    value === "all"
                      ? undefined
                      : (value as api.ListResearchesFilters["status"]),
                }));
              }}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="pausada">Pausada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleOpenCreateForm}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Descoberta
          </Button>
        </div>
      </header>

      {researches.length === 0 && !isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
          <p className="text-muted-foreground">
            Nenhuma descoberta encontrada.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {researches.map((research) => (
            <Card key={research.id}>
              <CardHeader>
                <CardTitle>{research.title}</CardTitle>
                <CardDescription>{research.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">{research.methodology}</Badge>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEditForm(research)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>
              {selectedResearch ? "Editar Descoberta" : "Nova Descoberta"}
            </DialogTitle>
          </DialogHeader>
          <CreateResearchForm
            initialData={selectedResearch}
            onSuccess={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
