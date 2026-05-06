"use client";

import { useMemo, useState } from "react";

interface UsePaginationProps<T> {
  data: T[];

  itemsPerPage?: number;
}

export function usePagination<T>({
  data,
  itemsPerPage = 10,
}: UsePaginationProps<T>) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;

    const end = start + itemsPerPage;

    return data.slice(start, end);
  }, [data, page, itemsPerPage]);

  function nextPage() {
    setPage((prev) => Math.min(prev + 1, totalPages));
  }

  function previousPage() {
    setPage((prev) => Math.max(prev - 1, 1));
  }

  function goToPage(targetPage: number) {
    setPage(targetPage);
  }

  return {
    page,

    totalPages,

    paginatedData,

    nextPage,

    previousPage,

    goToPage,

    setPage,
  };
}
