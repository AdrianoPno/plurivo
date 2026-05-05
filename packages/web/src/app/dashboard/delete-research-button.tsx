"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import * as api from "@/lib/api";
import { Button } from "@/components/ui/button";

interface DeleteResearchButtonProps {
  researchId: string;
  researchTitle: string;
  onSuccess?: () => void;
}

export function DeleteResearchButton({
  researchId,
  researchTitle,
  onSuccess,
}: DeleteResearchButtonProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteResearch(id),
    onSuccess: () => {
      // Invalida a query de listagem para que a UI seja atualizada
      queryClient.invalidateQueries({ queryKey: ["researches"] });
      onSuccess?.();
    },
    onError: (error) => {
      // O erro já é tratado pelo toast.promise, mas podemos logar aqui.
      console.error("Failed to delete research:", error);
    },
  });

  const handleConfirmation = () => {
    toast("Confirmar Exclusão", {
      description: `Você tem certeza que deseja excluir a pesquisa "${researchTitle}"? Esta ação não pode ser desfeita.`,
      action: {
        label: "Excluir",
        onClick: () =>
          toast.promise(deleteMutation.mutateAsync(researchId), {
            loading: "Excluindo...",
            success: `A pesquisa foi excluída com sucesso.`,
            error: "Falha ao excluir a pesquisa.",
          }),
      },
      cancel: {
        label: "Cancelar",
        onClick: () => {},
      },
    });
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleConfirmation}
      disabled={deleteMutation.isPending}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
    </Button>
  );
}
