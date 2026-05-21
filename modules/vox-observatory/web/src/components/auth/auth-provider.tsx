"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { useAuthStore } from "@/store/use-auth-store";
import { usePathname, useRouter } from "next/navigation";
import * as api from "@/lib/api";
import { firebaseAuth } from "@shared/firebase/auth";
import { Loader2 } from "lucide-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(true);
  const [statusMsg, setStatusMsg] = useState("Conectando ao Firebase...");

  useEffect(() => {
    const handleAuthChange = async (firebaseUser: FirebaseUser | null) => {
      try {
        const apiToken = localStorage.getItem("vox-api-token");

        if (pathname === "/login") {
          setUser(null);
          localStorage.removeItem("vox-api-token");
          setIsInitializing(false);
          return;
        }

        if (firebaseUser && apiToken) {
          if (!isAuthenticated) {
            setStatusMsg("Sincronizando perfil com a API...");

            // Impede o carregamento infinito: Se a API não responder em 8 segundos, força um erro.
            const apiUser = (await Promise.race([
              api.getMe(),
              new Promise((_, reject) =>
                setTimeout(
                  () => reject(new Error("Timeout na comunicação com a API")),
                  8000,
                ),
              ),
            ])) as any;

            setUser(apiUser);
          }
        } else {
          setStatusMsg("Sessão inválida. Redirecionando...");
          setUser(null);
          localStorage.removeItem("vox-api-token");
          router.replace("/login");
        }
      } catch (error) {
        console.error("Auth provider erro:", error);
        setStatusMsg("Erro ao restaurar sessão. Redirecionando...");
        setUser(null);
        localStorage.removeItem("vox-api-token");
        await signOut(firebaseAuth).catch(() => {});
        router.replace("/login");
      } finally {
        // Independente de sucesso ou falha, SEMPRE remove o spinner no final.
        setIsInitializing(false);
      }
    };

    const unsubscribe = onAuthStateChanged(firebaseAuth, handleAuthChange);
    return () => unsubscribe();
  }, [pathname, isAuthenticated, setUser, router]);

  // Bloqueia a renderização das páginas protegidas até o Firebase confirmar a sessão
  if (isInitializing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-200 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
        <p className="text-sm font-medium animate-pulse">{statusMsg}</p>
      </div>
    );
  }

  return <>{children}</>;
}
