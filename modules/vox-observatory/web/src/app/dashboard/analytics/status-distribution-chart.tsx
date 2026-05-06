"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";

interface StatusDistributionChartProps {
  data: {
    em_andamento: number;
    concluida: number;
    pausada: number;
  };
}

const STATUS_CONFIG = {
  em_andamento: {
    name: "Em andamento",
    color: "hsl(var(--status-ongoing-bg))",
  },
  concluida: {
    name: "Concluída",
    color: "hsl(var(--status-completed-bg))",
  },
  pausada: {
    name: "Pausada",
    color: "hsl(var(--status-paused-bg))",
  },
} as const;

export function StatusDistributionChart({
  data,
}: StatusDistributionChartProps) {
  const chartData = Object.entries(data).map(([status, value]) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];

    return {
      status,
      name: config.name,
      value,
      color: config.color,
    };
  });

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <Card className="rounded-[28px] border-border/60 bg-card/80 shadow-sm">
        <CardHeader>
          <CardTitle>Distribuição por status</CardTitle>
        </CardHeader>

        <CardContent className="flex h-[320px] items-center justify-center">
          <p className="max-w-sm text-center text-sm text-muted-foreground">
            Nenhum dado encontrado para exibir a distribuição por status.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-[28px] border-border/60 bg-card/80 shadow-sm">
      <CardHeader>
        <CardTitle>Distribuição por status</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid min-h-[320px] grid-cols-1 gap-6 lg:grid-cols-[1fr_180px]">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={96}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  stroke="hsl(var(--card))"
                  strokeWidth={4}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.status} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--popover))",
                    color: "hsl(var(--popover-foreground))",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
                  }}
                  labelStyle={{
                    color: "hsl(var(--foreground))",
                    fontWeight: 600,
                  }}
                  formatter={(value) => [
                    `${Number(value)} pesquisa(s)`,
                    "Total",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col justify-center gap-3">
            {chartData.map((item) => {
              const percentage =
                total > 0 ? Math.round((item.value / total) * 100) : 0;

              return (
                <div
                  key={item.status}
                  className="rounded-2xl border bg-background/60 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />

                      <span className="text-sm font-medium">{item.name}</span>
                    </div>

                    <span className="text-sm font-semibold">{percentage}%</span>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.value} pesquisa(s)
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
