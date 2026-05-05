"use client";

import { useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/use-auth-store";
import { usePathname } from "next/navigation"; // Importante
import * as api from "@/lib/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, isAuthenticated } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const token = localStorage.getItem("vox-api-token");
      const isPublicPage = pathname === "/login";

      // TRAVA DE OURO: Se estivermos no login, limpa o estado e ignora o resto.
      if (isPublicPage) {
        // Se houver lixo de sessão, limpamos, mas não rodamos lógica de fetch.
        if (!token && firebaseUser) await signOut(auth);
        return;
      }

      // Cenário 1: Tentativa de restauração de sessão
      if (firebaseUser && token) {
        if (!isAuthenticated) {
          try {
            const apiUser = await api.getMe();
            setUser(apiUser);
          } catch (error: unknown) {
            console.error("Auth provider: Session sync failed.", error);

            // Sincronização em cadeia: Falhou na API? Mata o Firebase e o Token.
            localStorage.removeItem("vox-api-token");
            setUser(null);
            await signOut(auth);
          }
        }
      }
      // Cenário 2: Logout ou Sessão Inválida
      else {
        // Só rodamos o signOut se houver um usuário no Firebase para evitar loops inúteis
        if (firebaseUser || token) {
          localStorage.removeItem("vox-api-token");
          setUser(null);
          if (firebaseUser) await signOut(auth);
        }
      }
    });

    return () => unsubscribe();
  }, [setUser, isAuthenticated, pathname]); // pathname precisa estar aqui

  return <>{children}</>;
}
