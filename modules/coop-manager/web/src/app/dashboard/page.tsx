"use client";

import { useEffect, useState } from "react";
import { Card } from "@shared/ui/card";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import api from "@/lib/api";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  overview: {
    totalCooperados: number;
    complianceRate: number;
    newCooperadosThisMonth: number;
  };
  alerts: {
    inactivity: number;
    documentation: number;
    total: number;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await api.get<{ data: DashboardStats }>(
          "/dashboard/stats",
        );
        setStats(response.data.data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">
              Dashboard
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-white">
              Visão geral
            </h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Controle rápido do sistema Coop Manager e seus principais
              indicadores.
            </p>
          </div>
          <Button asChild variant="secondary" size="sm">
            <Link href="/dashboard/cooperados">Ver cooperados</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
                Cooperados
              </p>
              <p className="mt-3 text-4xl font-semibold text-white">
                {loading ? "..." : (stats?.overview.totalCooperados ?? "N/A")}
              </p>
            </div>
            <Badge>Atual</Badge>
          </div>
        </Card>

        <Card className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
                Conformidade
              </p>
              <p className="mt-3 text-4xl font-semibold text-white">
                {loading ? "..." : (stats?.overview.complianceRate ?? "N/A")}%
              </p>
            </div>
            <Badge variant="secondary">Qualidade</Badge>
          </div>
        </Card>

        <Card className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
                Novos este mês
              </p>
              <p className="mt-3 text-4xl font-semibold text-white">
                {loading
                  ? "..."
                  : (stats?.overview.newCooperadosThisMonth ?? "N/A")}
              </p>
            </div>
            <Badge variant="secondary">Tendência</Badge>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-xl font-semibold text-white">Alertas críticos</h2>
          <div className="mt-5 space-y-4 text-slate-300">
            <p>
              Cooperados com documentação pendente:{" "}
              {loading ? "..." : (stats?.alerts.documentation ?? "N/A")}
            </p>
            <p>
              Cooperados com inatividade:{" "}
              {loading ? "..." : (stats?.alerts.inactivity ?? "N/A")}
            </p>
            <p>
              Total de alertas:{" "}
              {loading ? "..." : (stats?.alerts.total ?? "N/A")}
            </p>
          </div>
        </Card>

        <Card className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-xl font-semibold text-white">Ações rápidas</h2>
          <div className="mt-5 grid gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/cooperados">Cooperados</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/unidades">Unidades</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/usuarios">Usuários</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
