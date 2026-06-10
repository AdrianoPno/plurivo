"use client";

import { useEffect, type ReactNode } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";

import { useAuth } from "./auth-context.js";

interface PrivateRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function PrivateRoute({
  children,
  redirectTo = "/login",
}: PrivateRouteProps) {
  const router = useRouter();
  const { user, isLoading, authError } = useAuth();

  useEffect(() => {
    if (!isLoading && !user && !authError) {
      if (/^https?:\/\//.test(redirectTo)) {
        window.location.assign(redirectTo);
        return;
      }

      router.replace(redirectTo as Route);
    }
  }, [isLoading, user, authError, redirectTo, router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </main>
    );
  }

  if (!user) {
    if (authError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-background px-6">
          <div className="max-w-md rounded-3xl border border-border bg-card p-8 text-center text-card-foreground shadow-sm">
            <h1 className="text-xl font-semibold tracking-tight">
              Acesso negado
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {authError}
            </p>
          </div>
        </main>
      );
    }

    return null;
  }

  return <>{children}</>;
}
