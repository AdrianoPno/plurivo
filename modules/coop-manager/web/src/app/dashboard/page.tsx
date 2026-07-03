"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Building2, FileWarning, UserPlus, Users } from "lucide-react";

import api from "@/lib/api";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Card, CardContent } from "@shared/ui/card";

interface DashboardStats {
  overview: { totalCooperados: number; complianceRate: number; newCooperadosThisMonth: number };
  alerts: { inactivity: number; documentation: number; total: number };
}

function MetricCard({ label, value, icon: Icon, detail }: { label: string; value: string | number; icon: typeof Users; detail: string }) {
  return (
    <Card className="rounded-[28px] border-border/60 bg-card/80">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-sm font-medium text-muted-foreground">{label}</p><p className="mt-3 text-4xl font-semibold tracking-tight">{value}</p></div>
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-5" /></div>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: DashboardStats }>("/dashboard/stats")
      .then((response) => setStats(response.data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const value = (input?: number, suffix = "") => loading ? "..." : input === undefined ? "N/A" : `${input}${suffix}`;

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[32px] border border-border bg-[hsl(var(--primary))] p-8 text-primary-foreground shadow-2xl shadow-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_35%)]" />
        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl space-y-4">
            <Badge className="rounded-full border-0 bg-white/10 px-4 py-1 text-white">Pessoas e Unidades</Badge>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight">Visao geral da operacao</h1>
              <p className="text-base leading-relaxed text-white/75">Acompanhe pessoas, conformidade e pendencias das unidades em um unico lugar.</p>
            </div>
          </div>
          <Button asChild size="lg" className="h-12 rounded-2xl bg-white text-[hsl(var(--primary))] hover:bg-white/90">
            <Link href="/dashboard/cooperados"><Users className="mr-2 size-4" />Gerenciar pessoas</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Pessoas cadastradas" value={value(stats?.overview.totalCooperados)} icon={Users} detail="Total ativo na base operacional" />
        <MetricCard label="Conformidade" value={value(stats?.overview.complianceRate, "%")} icon={FileWarning} detail="Documentacao e dados regulares" />
        <MetricCard label="Novos neste mes" value={value(stats?.overview.newCooperadosThisMonth)} icon={UserPlus} detail="Entradas registradas no periodo" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[28px] border-border/60 bg-card/80">
          <CardContent className="p-6">
            <div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-2xl bg-destructive/10 text-destructive"><AlertTriangle className="size-5" /></div><div><h2 className="font-semibold">Atencao necessaria</h2><p className="text-sm text-muted-foreground">Pendencias que precisam de acompanhamento</p></div></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[['Documentacao', stats?.alerts.documentation], ['Inatividade', stats?.alerts.inactivity], ['Total', stats?.alerts.total]].map(([label, count]) => (
                <div key={String(label)} className="rounded-2xl border border-border bg-background/60 p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold">{value(count as number | undefined)}</p></div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-border/60 bg-card/80">
          <CardContent className="p-6">
            <h2 className="font-semibold">Acessos rapidos</h2><p className="mt-1 text-sm text-muted-foreground">Continue pelas areas mais utilizadas.</p>
            <div className="mt-5 space-y-3">
              {[['Pessoas', '/dashboard/cooperados', Users], ['Unidades', '/dashboard/unidades', Building2]].map(([label, href, Icon]) => (
                <Button key={String(label)} asChild variant="outline" className="h-12 w-full justify-start rounded-2xl"><Link href={{ pathname: String(href) }}><Icon className="mr-3 size-4" />{String(label)}<ArrowRight className="ml-auto size-4" /></Link></Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
