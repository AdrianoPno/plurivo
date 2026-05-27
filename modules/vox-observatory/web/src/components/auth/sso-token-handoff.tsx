"use client";

import { useEffect, useState, type ReactNode } from "react";

const TOKEN_KEY = "platform-token";
const HASH_KEY = "platform_token";

interface SsoTokenHandoffProps {
  children: ReactNode;
}

export function SsoTokenHandoff({ children }: SsoTokenHandoffProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const token = params.get(HASH_KEY);

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      params.delete(HASH_KEY);

      const nextHash = params.toString();
      const nextUrl = `${window.location.pathname}${window.location.search}${
        nextHash ? `#${nextHash}` : ""
      }`;

      window.history.replaceState(null, "", nextUrl);
    }

    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </main>
    );
  }

  return <>{children}</>;
}
