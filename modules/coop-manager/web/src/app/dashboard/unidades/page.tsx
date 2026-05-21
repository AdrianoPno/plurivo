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
      <div className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Unidades</h1>
        <p className="mt-3 text-slate-400">
          Gerencie e visualize as unidades que fazem parte do sistema.
        </p>
      </div>

      <Card className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-0 shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400">
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
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    Carregando unidades...
                  </td>
                </tr>
              ) : unidades.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    Nenhuma unidade encontrada.
                  </td>
                </tr>
              ) : (
                unidades.map((item) => (
                  <tr key={item.id} className="border-t border-slate-800">
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
