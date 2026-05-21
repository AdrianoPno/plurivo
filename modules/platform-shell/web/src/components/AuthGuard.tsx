"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth.js"; // Já estava correto, apenas para confirmar

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redireciona para a página de login, passando a URL atual como parâmetro
      router.push(
        `/login?redirectTo=${encodeURIComponent(window.location.pathname)}`,
      );
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) return null; // Ou um spinner de carregamento
  return <>{children}</>;
};
