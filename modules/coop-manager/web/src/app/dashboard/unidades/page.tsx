"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card } from "@shared/ui/card";

interface Unidade {
  id: string;
  nome: string;
  sigla: string;
  status: string;
}

export default function UnidadesPage() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUnidades() {
      try {
        const response = await api.get<{ data: Unidade[] }>("/unidades");
        setUnidades(response.data.data || []);
      } catch {
        setUnidades([]);
      } finally {
        setLoading(false);
      }
    }

    loadUnidades();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-border bg-card p-8 text-card-foreground shadow-sm">
        <h1 className="text-3xl font-semibold text-foreground">Unidades</h1>
        <p className="mt-3 text-muted-foreground">
          Gerencie e visualize as unidades que fazem parte do sistema.
        </p>
      </div>

      <Card className="overflow-hidden rounded-3xl p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-card-foreground">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Sigla</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-10 text-center text-muted-foreground"
                  >
                    Carregando unidades...
                  </td>
                </tr>
              ) : unidades.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-10 text-center text-muted-foreground"
                  >
                    Nenhuma unidade encontrada.
                  </td>
                </tr>
              ) : (
                unidades.map((item) => (
                  <tr key={item.id} className="border-t border-border">
                    <td className="px-6 py-4">{item.nome}</td>
                    <td className="px-6 py-4">{item.sigla}</td>
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
