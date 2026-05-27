"use client";

import { useState, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@shared/auth/auth-provider";
import { MODULE_URLS } from "@shared/constants/modules";

export function Providers({ children }: { children: ReactNode }) {
  // Mantém a instância do QueryClient isolada por requisição para evitar vazamento de cache no SSR
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutos
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider profileUrl={`${MODULE_URLS.platformShell.api}/auth/me`}>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
