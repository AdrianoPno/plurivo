"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import Cookies from "js-cookie";
import * as api from "@/lib/api";
import { useAuthStore } from "@/store/use-auth-store";
import { useLoadingStore } from "@/store/use-loading-store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { auth } from "@/lib/firebase";
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const isLoading = useLoadingStore((state) => state.isLoading);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    useLoadingStore.getState().startLoading();
    setError(null);

    try {
      // 1. Autentica com o Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const firebaseIdToken = await userCredential.user.getIdToken();

      // 2. Troca o token do Firebase pelo token da API interna
      const apiToken =
        await api.exchangeFirebaseTokenForApiToken(firebaseIdToken);

      // 3. Armazena o token da API para ser usado pelo interceptor do Axios e pelo middleware
      localStorage.setItem("vox-api-token", apiToken);
      Cookies.set("session", apiToken, { expires: 7, path: "/" });

      // 4. Busca os dados completos do usuário (incluindo role) do backend
      const apiUser = await api.getMe();

      // 5. Atualiza o estado global com os dados da API
      setUser(apiUser);

      router.replace("/dashboard");
    } catch (err: any) {
      console.error("Auth Error:", err.code);

      // Tratamento de erro amigável
      const message =
        err.code === "auth/invalid-credential"
          ? "E-mail ou senha incorretos."
          : "Ocorreu um erro ao tentar acessar a conta.";

      setError(message);
    } finally {
      useLoadingStore.getState().stopLoading();
    }
  }

  return (
    <Card className="border-none shadow-none sm:border sm:shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="grid gap-4">
          {error && (
            <div className="bg-destructive/15 p-3 rounded-md text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Autenticando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
