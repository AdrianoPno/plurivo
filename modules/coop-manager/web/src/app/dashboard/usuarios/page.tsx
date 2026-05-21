"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card } from "@shared/ui/card";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
  unidadeNome?: string;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsuarios() {
      try {
        const response = await api.get<{ data: Usuario[] }>("/users");
        setUsuarios(response.data.data || []);
      } catch {
        setUsuarios([]);
      } finally {
        setLoading(false);
      }
    }

    loadUsuarios();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Usuários</h1>
        <p className="mt-3 text-slate-400">
          Controle os perfis que acessam o sistema e as funções atribuídas.
        </p>
      </div>

      <Card className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-0 shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">E-mail</th>
                <th className="px-6 py-4">Função</th>
                <th className="px-6 py-4">Unidade</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    Carregando usuários...
                  </td>
                </tr>
              ) : usuarios.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                usuarios.map((item) => (
                  <tr key={item.id} className="border-t border-slate-800">
                    <td className="px-6 py-4">{item.nome}</td>
                    <td className="px-6 py-4">{item.email}</td>
                    <td className="px-6 py-4">{item.role}</td>
                    <td className="px-6 py-4">{item.unidadeNome ?? "-"}</td>
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
