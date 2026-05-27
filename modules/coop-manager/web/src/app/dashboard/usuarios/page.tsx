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
      <div className="rounded-[32px] border border-border bg-card p-8 text-card-foreground shadow-sm">
        <h1 className="text-3xl font-semibold text-foreground">Usuários</h1>
        <p className="mt-3 text-muted-foreground">
          Controle os perfis que acessam o sistema e as funções atribuídas.
        </p>
      </div>

      <Card className="overflow-hidden rounded-3xl p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm text-card-foreground">
            <thead className="bg-muted text-muted-foreground">
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
                    className="px-6 py-10 text-center text-muted-foreground"
                  >
                    Carregando usuários...
                  </td>
                </tr>
              ) : usuarios.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-muted-foreground"
                  >
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                usuarios.map((item) => (
                  <tr key={item.id} className="border-t border-border">
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
