"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card } from "@shared/ui/card";

interface Cooperado {
  id: string;
  nome: string;
  cpf: string;
  cargo: string;
  status: string;
  unidadeId?: string;
}

export default function CooperadosPage() {
  const [cooperados, setCooperados] = useState<Cooperado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCooperados() {
      try {
        const response = await api.get<{ data: Cooperado[] }>("/cooperados");
        setCooperados(response.data.data || []);
      } catch {
        setCooperados([]);
      } finally {
        setLoading(false);
      }
    }

    loadCooperados();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-border bg-card p-8 text-card-foreground shadow-sm">
        <h1 className="text-3xl font-semibold text-foreground">Cooperados</h1>
        <p className="mt-3 text-muted-foreground">
          Lista de cooperados ativos e o status cadastrado no sistema.
        </p>
      </div>

      <Card className="overflow-hidden rounded-3xl p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-card-foreground">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">CPF</th>
                <th className="px-6 py-4">Cargo</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-muted-foreground"
                  >
                    Carregando cooperados...
                  </td>
                </tr>
              ) : cooperados.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-muted-foreground"
                  >
                    Nenhum cooperado encontrado.
                  </td>
                </tr>
              ) : (
                cooperados.map((item) => (
                  <tr key={item.id} className="border-t border-border">
                    <td className="px-6 py-4">{item.nome}</td>
                    <td className="px-6 py-4">{item.cpf}</td>
                    <td className="px-6 py-4">{item.cargo}</td>
                    <td className="px-6 py-4">{item.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
