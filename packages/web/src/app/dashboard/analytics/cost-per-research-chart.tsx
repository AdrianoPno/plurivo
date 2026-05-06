"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import * as api from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CostPerResearchChartProps {
  researches: api.Research[];
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const compactCurrencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatCompactCurrency(value: number) {
  return compactCurrencyFormatter.format(value);
}

function truncateLabel(value: string, maxLength = 16) {
  if (value.length <= maxLength) return value;

  return `${value.slice(0, maxLength)}...`;
}

export function CostPerResearchChart({
  researches,
}: CostPerResearchChartProps) {
  const chartData = researches.map((research) => ({
    name: truncateLabel(research.title),
    fullName: research.title,
    estimatedCost: research.estimatedCost ?? 0,
  }));

  if (researches.length === 0) {
    return (
      <Card className="rounded-[28px] border-border/60 bg-card/80 shadow-sm">
        <CardHeader>
          <CardTitle>Custo por pesquisa</CardTitle>
        </CardHeader>

        <CardContent className="flex h-[320px] items-center justify-center">
          <p className="max-w-sm text-center text-sm text-muted-foreground">
            Nenhuma pesquisa encontrada para exibir os custos estimados.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-[28px] border-border/60 bg-card/80 shadow-sm">
      <CardHeader>
        <CardTitle>Custo por pesquisa</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 8,
                right: 12,
                left: 8,
                bottom: 8,
              }}
            >
              <CartesianGrid
                stroke="hsl(var(--border))"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12,
                }}
                tickFormatter={(value) => formatCompactCurrency(Number(value))}
              />

              <Tooltip
                cursor={{
                  fill: "hsl(var(--muted))",
                  radius: 12,
                }}
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
                  formatCurrency(Number(value)),
                  "Custo estimado",
                ]}
                labelFormatter={(_, payload) => {
                  const item = payload?.[0]?.payload;

                  return item?.fullName ?? "Pesquisa";
                }}
              />

              <Bar
                dataKey="estimatedCost"
                name="Custo estimado"
                fill="hsl(var(--secondary))"
                radius={[10, 10, 0, 0]}
                maxBarSize={56}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
