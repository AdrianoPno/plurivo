"use client";

import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

// 1. Melhoria no tipo Column: key agora aceita string livre para suportar colunas customizadas (ex: "actions")
export interface Column<T> {
  key: keyof T | (string & {});
  title: string;
  render?: (value: any, row: T) => ReactNode;
}

// 2. Inclusão das propriedades que o seu page.tsx está passando na listagem
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  isLoading?: boolean; // Adicionado suporte a loading nativo
  filterColumn?: string; // Declarado para evitar erros de propriedade implícita
  filterPlaceholder?: string; // Declarado para evitar erros de propriedade implícita
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  emptyMessage = "Nenhum registro encontrado.",
  isLoading = false,
}: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            // Fallback para index garante unicidade mesmo com chaves dinâmicas duplicadas
            <TableHead key={String(column.key) + index}>
              {column.title}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {/* 3. Renderização do estado de Loading se a API estiver processando a busca */}
        {isLoading && (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="py-8 text-center text-zinc-500 font-medium animate-pulse"
            >
              Carregando dados...
            </TableCell>
          </TableRow>
        )}

        {/* Exibe mensagem vazia apenas se não estiver carregando e o array for zero */}
        {!isLoading && data.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="py-8 text-center text-zinc-500"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}

        {/* Renderização das linhas de dados consolidados */}
        {!isLoading &&
          data.map((row, rowIndex) => (
            <TableRow key={row.uid || row.id || rowIndex}>
              {columns.map((column, colIndex) => {
                // Safe-navigation para chaves virtuais como "actions" que não existem no objeto data
                const value =
                  typeof column.key === "string" && column.key in row
                    ? row[column.key as keyof T]
                    : undefined;

                return (
                  <TableCell key={String(column.key) + colIndex}>
                    {column.render
                      ? column.render(value, row)
                      : String(value ?? "")}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
