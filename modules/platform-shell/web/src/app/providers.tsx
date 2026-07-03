"use client";

import { useState, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@shared/auth/auth-provider.js";
import { MODULE_URLS } from "@shared/constants/modules";
import { TenantProvider } from "@shared/tenant";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Mantém a instância isolada por requisição para evitar vazamento de cache em SSR
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
        <TenantProvider tenantUrl={`${MODULE_URLS.platformShell.api}/tenants/current`}>
          {children}
        </TenantProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
