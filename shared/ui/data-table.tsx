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

interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: any, row: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];

  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  emptyMessage = "Nenhum registro encontrado.",
}: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={String(column.key)}>{column.title}</TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="py-8 text-center text-zinc-500"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}

        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((column) => {
              const value = row[column.key];

              return (
                <TableCell key={String(column.key)}>
                  {column.render ? column.render(value, row) : String(value)}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
