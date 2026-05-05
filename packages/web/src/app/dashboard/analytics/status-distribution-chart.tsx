"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusDistributionChartProps {
  data: {
    em_andamento: number;
    concluida: number;
    pausada: number;
  };
}

const COLORS = {
  em_andamento: "#3b82f6", // blue-500
  concluida: "#22c55e", // green-500
  pausada: "#f97316", // orange-500
};

const STATUS_NAMES = {
  em_andamento: "Em Andamento",
  concluida: "Concluída",
  pausada: "Pausada",
};

export function StatusDistributionChart({
  data,
}: StatusDistributionChartProps) {
  const chartData = Object.entries(data).map(([status, value]) => ({
    name: STATUS_NAMES[status as keyof typeof STATUS_NAMES],
    value,
    color: COLORS[status as keyof typeof COLORS],
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Status</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-muted-foreground">
            Nenhum dado para exibir no gráfico.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => {
                  if (typeof value === "number") return [value, "Pesquisas"];
                  return [0, "Pesquisas"];
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
