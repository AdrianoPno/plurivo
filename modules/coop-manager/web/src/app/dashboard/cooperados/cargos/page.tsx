"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";

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

interface Cargo {
  id: string;
  nome: string;
  limiteVagas: number;
  ativo: boolean;
  ocupadas: number;
  disponiveis: number;
}

interface CargoFormData {
  nome: string;
  limiteVagas: string;
}

const initialFormData: CargoFormData = {
  nome: "",
  limiteVagas: "1",
};

export default function CargosPage() {
  const { user } = useAuth();
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCargo, setEditingCargo] = useState<Cargo | null>(null);
  const [formData, setFormData] = useState<CargoFormData>(initialFormData);

  const canManage = user?.role === "SUPER";

  async function loadCargos() {
    setLoading(true);

    try {
      const response = await api.get<{ data: Cargo[] }>("/cargos");
      setCargos(response.data.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Falha ao carregar cargos.");
      setCargos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCargos();
  }, []);

  function openCreateDialog() {
    setEditingCargo(null);
    setFormData(initialFormData);
    setDialogOpen(true);
  }

  function openEditDialog(cargo: Cargo) {
    setEditingCargo(cargo);
    setFormData({
      nome: cargo.nome,
      limiteVagas: String(cargo.limiteVagas),
    });
    setDialogOpen(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const payload = {
      nome: formData.nome,
      limiteVagas: Number(formData.limiteVagas),
    };

    try {
      if (editingCargo) {
        await api.put(`/cargos/${editingCargo.id}`, payload);
        toast.success("Cargo atualizado com sucesso.");
      } else {
        await api.post("/cargos", payload);
        toast.success("Cargo criado com sucesso.");
      }

      setDialogOpen(false);
      await loadCargos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Falha ao salvar cargo.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(cargo: Cargo) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o cargo ${cargo.nome}?`,
    );

    if (!confirmed) return;

    try {
      await api.delete(`/cargos/${cargo.id}`);
      toast.success("Cargo excluido com sucesso.");
      await loadCargos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Falha ao excluir cargo.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-border bg-card p-8 text-card-foreground shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-primary">
              Cooperados
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-foreground">
              Cargos e vagas
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Defina a capacidade de cada cargo e acompanhe a ocupacao atual.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/cooperados">
                <ArrowLeft className="mr-2 size-4" />
                Cooperados
              </Link>
            </Button>

            {canManage && (
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 size-4" />
                Adicionar cargo
              </Button>
            )}
          </div>
        </div>
      </div>

      <Card className="overflow-hidden rounded-3xl p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-card-foreground">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Cargo</th>
                <th className="px-6 py-4">Ocupadas</th>
                <th className="px-6 py-4">Limite</th>
                <th className="px-6 py-4">Disponiveis</th>
                {canManage && <th className="px-6 py-4 text-right">Acoes</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={canManage ? 5 : 4}
                    className="px-6 py-10 text-center text-muted-foreground"
                  >
                    Carregando cargos...
                  </td>
                </tr>
              ) : cargos.length === 0 ? (
                <tr>
                  <td
                    colSpan={canManage ? 5 : 4}
                    className="px-6 py-10 text-center text-muted-foreground"
                  >
                    Nenhum cargo encontrado.
                  </td>
                </tr>
              ) : (
                cargos.map((cargo) => (
                  <tr key={cargo.id} className="border-t border-border">
                    <td className="px-6 py-4 font-medium">{cargo.nome}</td>
                    <td className="px-6 py-4">{cargo.ocupadas}</td>
                    <td className="px-6 py-4">{cargo.limiteVagas}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={cargo.disponiveis > 0 ? "default" : "secondary"}
                      >
                        {cargo.disponiveis}
                      </Badge>
                    </td>
                    {canManage && (
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(cargo)}
                          >
                            <Edit className="mr-2 size-4" />
                            Editar
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(cargo)}
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
            <DialogTitle>
              {editingCargo ? "Editar cargo" : "Adicionar cargo"}
            </DialogTitle>
            <DialogDescription>
              Configure o nome e o limite de vagas para este cargo.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Cargo</label>
              <Input
                value={formData.nome}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    nome: event.target.value,
                  }))
                }
                placeholder="Presidente"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Limite de vagas
              </label>
              <Input
                type="number"
                min={1}
                value={formData.limiteVagas}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    limiteVagas: event.target.value,
                  }))
                }
                required
              />
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
