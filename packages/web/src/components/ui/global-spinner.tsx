"use client";

import { useLoadingStore } from "@/store/use-loading-store";
import { Loader2 } from "lucide-react";

export function GlobalSpinner() {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    </div>
  );
}
