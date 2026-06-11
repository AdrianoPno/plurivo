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

type Sexo = "Masculino" | "Feminino" | "Outro";
type TipoVinculo = "COOP" | "RPA";
type StatusCooperado = "ATIVO" | "INATIVO" | "PENDENTE";

interface Cooperado {
  id: string;
  ID_COOPERADO: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: Sexo;
  etnia: string;
  escolaridade: string;
  cargo: string;
  tipoVinculo: TipoVinculo;
  status: StatusCooperado;
  dataEntrada: string;
  dataSaida?: string | null;
  unidadeId?: string;
}

interface Unidade {
  id: string;
  nome: string;
  sigla: string;
  status: "ATIVO" | "INATIVO";
}

interface CooperadoFormData {
  ID_COOPERADO: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: Sexo;
  etnia: string;
  escolaridade: string;
  cargo: string;
  tipoVinculo: TipoVinculo;
  status: StatusCooperado;
  dataEntrada: string;
  dataSaida: string;
  unidadeId: string;
}

const today = new Date().toISOString().slice(0, 10);

const initialFormData: CooperadoFormData = {
  ID_COOPERADO: "",
  nome: "",
  cpf: "",
  dataNascimento: "",
  sexo: "Masculino",
  etnia: "",
  escolaridade: "",
  cargo: "",
  tipoVinculo: "COOP",
  status: "ATIVO",
  dataEntrada: today,
  dataSaida: "",
  unidadeId: "",
};

export default function CooperadosPage() {
  const { user } = useAuth();
  const [cooperados, setCooperados] = useState<Cooperado[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCooperado, setEditingCooperado] = useState<Cooperado | null>(
    null,
  );
  const [formData, setFormData] =
    useState<CooperadoFormData>(initialFormData);

  const canWrite =
    user?.role === "SUPER" || user?.role === "ADMIN" || user?.role === "USER";
  const canDelete = user?.role === "SUPER" || user?.role === "ADMIN";
  const showActions = canWrite || canDelete;
  const isSuper = user?.role === "SUPER";

  const dialogTitle = useMemo(
    () => (editingCooperado ? "Editar cooperado" : "Adicionar cooperado"),
    [editingCooperado],
  );

  const unidadeNomeById = useMemo(
    () => new Map(unidades.map((unidade) => [unidade.id, unidade.nome])),
    [unidades],
  );

  async function loadData() {
    setLoading(true);

    try {
      const [cooperadosResponse, unidadesResponse] = await Promise.all([
        api.get<{ data: Cooperado[] }>("/cooperados"),
        api.get<{ data: Unidade[] }>("/unidades"),
      ]);

      setCooperados(cooperadosResponse.data.data || []);
      setUnidades(unidadesResponse.data.data || []);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Falha ao carregar cooperados.",
      );
      setCooperados([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreateDialog() {
    setEditingCooperado(null);
    setFormData(initialFormData);
    setDialogOpen(true);
  }

  function openEditDialog(cooperado: Cooperado) {
    setEditingCooperado(cooperado);
    setFormData({
      ID_COOPERADO: cooperado.ID_COOPERADO,
      nome: cooperado.nome,
      cpf: cooperado.cpf,
      dataNascimento: cooperado.dataNascimento,
      sexo: cooperado.sexo,
      etnia: cooperado.etnia,
      escolaridade: cooperado.escolaridade,
      cargo: cooperado.cargo,
      tipoVinculo: cooperado.tipoVinculo,
      status: cooperado.status,
      dataEntrada: cooperado.dataEntrada,
      dataSaida: cooperado.dataSaida || "",
      unidadeId: cooperado.unidadeId || "",
    });
    setDialogOpen(true);
  }

  function buildPayload() {
    const payload: Record<string, unknown> = {
      ...formData,
      dataSaida: formData.dataSaida || null,
    };

    if (!isSuper) {
      delete payload.unidadeId;
    }

    if (!payload.dataSaida) {
      delete payload.dataSaida;
    }

    return payload;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSuper && !formData.unidadeId) {
      toast.error("Selecione uma unidade para o cooperado.");
      return;
    }

    setSaving(true);

    try {
      if (editingCooperado) {
        await api.put(`/cooperados/${editingCooperado.id}`, buildPayload());
        toast.success("Cooperado atualizado com sucesso.");
      } else {
        await api.post("/cooperados", buildPayload());
        toast.success("Cooperado criado com sucesso.");
      }

      setDialogOpen(false);
      await loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Falha ao salvar cooperado.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(cooperado: Cooperado) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir ${cooperado.nome}?`,
    );

    if (!confirmed) return;

    try {
      await api.delete(`/cooperados/${cooperado.id}`);
      toast.success("Cooperado excluido com sucesso.");
      await loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Falha ao excluir cooperado.");
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
              Gestao de cooperados
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Cadastre, edite e acompanhe o vinculo operacional dos cooperados.
            </p>
          </div>

          {canWrite && (
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 size-4" />
              Adicionar cooperado
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
                <th className="px-6 py-4">CPF</th>
                <th className="px-6 py-4">Cargo</th>
                <th className="px-6 py-4">Unidade</th>
                <th className="px-6 py-4">Status</th>
                {showActions && <th className="px-6 py-4 text-right">Acoes</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={showActions ? 6 : 5}
                    className="px-6 py-10 text-center text-muted-foreground"
                  >
                    Carregando cooperados...
                  </td>
                </tr>
              ) : cooperados.length === 0 ? (
                <tr>
                  <td
                    colSpan={showActions ? 6 : 5}
                    className="px-6 py-10 text-center text-muted-foreground"
                  >
                    Nenhum cooperado encontrado.
                  </td>
                </tr>
              ) : (
                cooperados.map((item) => (
                  <tr key={item.id} className="border-t border-border">
                    <td className="px-6 py-4 font-medium">{item.nome}</td>
                    <td className="px-6 py-4">{item.cpf}</td>
                    <td className="px-6 py-4">{item.cargo}</td>
                    <td className="px-6 py-4">
                      {item.unidadeId
                        ? unidadeNomeById.get(item.unidadeId) || item.unidadeId
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={item.status === "ATIVO" ? "default" : "secondary"}>
                        {item.status}
                      </Badge>
                    </td>
                    {showActions && (
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {canWrite && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(item)}
                            >
                              <Edit className="mr-2 size-4" />
                              Editar
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(item)}
                            >
                              <Trash2 className="mr-2 size-4" />
                              Excluir
                            </Button>
                          )}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              Preencha os dados cadastrais e operacionais do cooperado.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Matricula">
                <Input
                  value={formData.ID_COOPERADO}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      ID_COOPERADO: event.target.value,
                    }))
                  }
                  required
                />
              </Field>

              <Field label="Nome completo">
                <Input
                  value={formData.nome}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      nome: event.target.value,
                    }))
                  }
                  required
                />
              </Field>

              <Field label="CPF">
                <Input
                  value={formData.cpf}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      cpf: event.target.value,
                    }))
                  }
                  required
                />
              </Field>

              <Field label="Data de nascimento">
                <Input
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      dataNascimento: event.target.value,
                    }))
                  }
                  required
                />
              </Field>

              <Field label="Sexo">
                <Select
                  value={formData.sexo}
                  onValueChange={(value) =>
                    setFormData((current) => ({
                      ...current,
                      sexo: value as Sexo,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Etnia">
                <Input
                  value={formData.etnia}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      etnia: event.target.value,
                    }))
                  }
                  required
                />
              </Field>

              <Field label="Escolaridade">
                <Input
                  value={formData.escolaridade}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      escolaridade: event.target.value,
                    }))
                  }
                  required
                />
              </Field>

              <Field label="Cargo ou funcao">
                <Input
                  value={formData.cargo}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      cargo: event.target.value,
                    }))
                  }
                  required
                />
              </Field>

              <Field label="Tipo de vinculo">
                <Select
                  value={formData.tipoVinculo}
                  onValueChange={(value) =>
                    setFormData((current) => ({
                      ...current,
                      tipoVinculo: value as TipoVinculo,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COOP">COOP</SelectItem>
                    <SelectItem value="RPA">RPA</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Status">
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((current) => ({
                      ...current,
                      status: value as StatusCooperado,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ATIVO">Ativo</SelectItem>
                    <SelectItem value="INATIVO">Inativo</SelectItem>
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Data de entrada">
                <Input
                  type="date"
                  value={formData.dataEntrada}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      dataEntrada: event.target.value,
                    }))
                  }
                  required
                />
              </Field>

              <Field label="Data de saida">
                <Input
                  type="date"
                  value={formData.dataSaida}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      dataSaida: event.target.value,
                    }))
                  }
                />
              </Field>

              {isSuper && (
                <Field label="Unidade">
                  <Select
                    value={formData.unidadeId}
                    onValueChange={(value) =>
                      setFormData((current) => ({
                        ...current,
                        unidadeId: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {unidades.map((unidade) => (
                        <SelectItem key={unidade.id} value={unidade.id}>
                          {unidade.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}
