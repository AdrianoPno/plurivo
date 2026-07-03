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
      <div className="relative overflow-hidden rounded-[32px] border border-border bg-[hsl(var(--primary))] p-8 text-primary-foreground shadow-2xl shadow-black/10">
        <p className="text-sm font-medium text-primary-foreground/70">Pessoas e Unidades</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-primary-foreground">Usuários</h1>
        <p className="mt-3 text-primary-foreground/75">
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
