"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Edit, Plus, Trash2 } from "lucide-react";

import api from "@/lib/api";
import { useAuth } from "@shared/auth";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Input } from "@shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";

type UnidadeStatus = "ATIVO" | "INATIVO";

interface Unidade {
  id: string;
  nome: string;
  sigla: string;
  status: UnidadeStatus;
}

interface UnidadeFormData {
  nome: string;
  sigla: string;
  status: UnidadeStatus;
}

const initialFormData: UnidadeFormData = {
  nome: "",
  sigla: "",
  status: "ATIVO",
};

export default function UnidadesPage() {
  const { user } = useAuth();
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUnidade, setEditingUnidade] = useState<Unidade | null>(null);
  const [formData, setFormData] = useState<UnidadeFormData>(initialFormData);

  const canManage = user?.role === "SUPER";

  const dialogTitle = useMemo(
    () => (editingUnidade ? "Editar unidade" : "Adicionar unidade"),
    [editingUnidade],
  );

  async function loadUnidades() {
    setLoading(true);

    try {
      const response = await api.get<{ data: Unidade[] }>("/unidades");
      setUnidades(response.data.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Falha ao carregar unidades.");
      setUnidades([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUnidades();
  }, []);

  function openCreateDialog() {
    setEditingUnidade(null);
    setFormData(initialFormData);
    setDialogOpen(true);
  }

  function openEditDialog(unidade: Unidade) {
    setEditingUnidade(unidade);
    setFormData({
      nome: unidade.nome,
      sigla: unidade.sigla,
      status: unidade.status,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      if (editingUnidade) {
        await api.put(`/unidades/${editingUnidade.id}`, formData);
        toast.success("Unidade atualizada com sucesso.");
      } else {
        await api.post("/unidades", formData);
        toast.success("Unidade criada com sucesso.");
      }

      setDialogOpen(false);
      await loadUnidades();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Falha ao salvar unidade.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(unidade: Unidade) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a unidade ${unidade.nome}?`,
    );

    if (!confirmed) return;

    try {
      await api.delete(`/unidades/${unidade.id}`);
      toast.success("Unidade excluida com sucesso.");
      await loadUnidades();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Falha ao excluir unidade.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-border bg-card p-8 text-card-foreground shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-primary">
              Unidades
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-foreground">
              Gestao de unidades
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Cadastre, edite e acompanhe as unidades operacionais do sistema.
            </p>
          </div>

          {canManage && (
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 size-4" />
              Adicionar unidade
            </Button>
          )}
        </div>
      </div>

      <Card className="overflow-hidden rounded-3xl p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-card-foreground">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Sigla</th>
                <th className="px-6 py-4">Status</th>
                {canManage && <th className="px-6 py-4 text-right">Acoes</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={canManage ? 4 : 3}
                    className="px-6 py-10 text-center text-muted-foreground"
                  >
                    Carregando unidades...
                  </td>
                </tr>
              ) : unidades.length === 0 ? (
                <tr>
                  <td
                    colSpan={canManage ? 4 : 3}
                    className="px-6 py-10 text-center text-muted-foreground"
                  >
                    Nenhuma unidade encontrada.
                  </td>
                </tr>
              ) : (
                unidades.map((item) => (
                  <tr key={item.id} className="border-t border-border">
                    <td className="px-6 py-4 font-medium">{item.nome}</td>
                    <td className="px-6 py-4">{item.sigla}</td>
                    <td className="px-6 py-4">
                      <Badge variant={item.status === "ATIVO" ? "default" : "secondary"}>
                        {item.status}
                      </Badge>
                    </td>
                    {canManage && (
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(item)}
                          >
                            <Edit className="mr-2 size-4" />
                            Editar
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Excluir
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              Informe os dados basicos da unidade operacional.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nome</label>
              <Input
                value={formData.nome}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    nome: event.target.value,
                  }))
                }
                placeholder="Unidade de Guaxupe"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Sigla</label>
              <Input
                value={formData.sigla}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    sigla: event.target.value,
                  }))
                }
                placeholder="gxp"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((current) => ({
                    ...current,
                    status: value as UnidadeStatus,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ATIVO">Ativo</SelectItem>
                  <SelectItem value="INATIVO">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
