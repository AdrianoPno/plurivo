"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Tempo que o dado é considerado "fresco" (5 segundos)
            staleTime: 5 * 1000,

            // Trava de segurança: Se a API responder 401, não tenta de novo.
            // Isso impede que o React Query alimente o loop de redirecionamento.
            retry: (failureCount, error: any) => {
              if (error?.response?.status === 401) {
                return false;
              }
              // Para outros erros (ex: rede), tenta apenas 2 vezes.
              return failureCount < 2;
            },

            // Evita refetch automático ao trocar de aba se o token puder estar expirado
            refetchOnWindowFocus: false,
          },
          mutations: {
            // Em formulários (POST/PUT), o ideal é não repetir automaticamente em caso de erro
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
