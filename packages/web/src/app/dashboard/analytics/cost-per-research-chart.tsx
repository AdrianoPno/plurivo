"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as api from "@/lib/api";

interface CostPerResearchChartProps {
  researches: api.Research[];
}

export function CostPerResearchChart({
  researches,
}: CostPerResearchChartProps) {
  const chartData = researches.map((r) => ({
    name: r.title.length > 15 ? `${r.title.substring(0, 15)}...` : r.title,
    Custo: r.estimatedCost,
  }));

  if (researches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Custo por Pesquisa</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-muted-foreground">
            Nenhuma pesquisa para exibir os custos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custo por Pesquisa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    notation: "compact",
                  }).format(value as number)
                }
              />
              <Tooltip
                formatter={(value) => {
                  if (typeof value === "number") {
                    return new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(value);
                  }
                  return "N/A";
                }}
              />
              <Bar dataKey="Custo" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
