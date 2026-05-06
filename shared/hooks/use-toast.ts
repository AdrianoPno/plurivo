"use client";

import { useCallback } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastParams {
  title: string;

  description?: string;

  type?: ToastType;
}

export function useToast() {
  const toast = useCallback(
    ({ title, description, type = "info" }: ToastParams) => {
      console.log(`[${type.toUpperCase()}] ${title}`);

      if (description) {
        console.log(description);
      }
    },
    [],
  );

  return {
    toast,
  };
}
