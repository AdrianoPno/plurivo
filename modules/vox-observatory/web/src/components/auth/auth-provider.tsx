"use client";

import { useEffect } from "react";
import {
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { useAuthStore } from "@/store/use-auth-store";
import { usePathname } from "next/navigation";
import * as api from "@/lib/api";
import { firebaseAuth } from "@shared/firebase/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, isAuthenticated } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    const handleAuthChange = async (firebaseUser: FirebaseUser | null) => {
      const apiToken = localStorage.getItem("vox-api-token");

      // Se o usuário está na página de login, não tentamos restaurar a sessão.
      // Apenas garantimos que qualquer estado de sessão anterior seja limpo.
      if (pathname === "/login") {
        if (isAuthenticated || apiToken) {
          setUser(null);
          localStorage.removeItem("vox-api-token");
        }
        return;
      }

      // Cenário 1: Sessão potencialmente válida.
      // Temos um usuário no Firebase e um token da nossa API.
      if (firebaseUser && apiToken) {
        // Se o estado global ainda não foi preenchido, tentamos sincronizar.
        if (!isAuthenticated) {
          try {
            // O interceptor do Axios já deve ter o token para esta chamada.
            const apiUser = await api.getMe();
            setUser(apiUser); // Sincroniza o estado com os dados da nossa API.
          } catch (error: unknown) {
            // Falha ao buscar usuário da API (token inválido, expirado, etc.).
            console.error("Auth provider: Falha ao sincronizar sessão.", error);
            // Limpeza completa da sessão em caso de falha.
            setUser(null);
            localStorage.removeItem("vox-api-token");
            await signOut(firebaseAuth);
          }
        }
        // Se `isAuthenticated` já é `true`, a sessão está ativa e não fazemos nada.
      } else {
        // Cenário 2: Sessão inválida ou inexistente.
        // Se não temos o par (firebaseUser, apiToken), o usuário está deslogado.
        if (isAuthenticated || apiToken) {
          setUser(null);
          localStorage.removeItem("vox-api-token");
        }
      }
    };

    const unsubscribe = onAuthStateChanged(firebaseAuth, handleAuthChange);
    return () => unsubscribe();
  }, [pathname, isAuthenticated, setUser]);

  return <>{children}</>;
}
