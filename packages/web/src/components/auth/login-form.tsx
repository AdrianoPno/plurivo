"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import Cookies from "js-cookie";
import { FirebaseError } from "firebase/app";
import { Loader2, Lock, Mail } from "lucide-react";

import * as api from "@/lib/api";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/use-auth-store";
import { useLoadingStore } from "@/store/use-loading-store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const isLoading = useLoadingStore((state) => state.isLoading);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    useLoadingStore.getState().startLoading();
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const firebaseIdToken = await userCredential.user.getIdToken();

      const apiToken =
        await api.exchangeFirebaseTokenForApiToken(firebaseIdToken);

      localStorage.setItem("vox-api-token", apiToken);

      Cookies.set("session", apiToken, {
        expires: 7,
        path: "/",
      });

      const apiUser = await api.getMe();

      setUser(apiUser);

      router.replace("/dashboard");
    } catch (err: unknown) {
      console.error("Auth Error:", err);

      let message = "Ocorreu um erro ao tentar acessar a conta.";

      if (
        err instanceof FirebaseError &&
        err.code === "auth/invalid-credential"
      ) {
        message = "E-mail ou senha incorretos.";
      }

      setError(message);
    } finally {
      useLoadingStore.getState().stopLoading();
    }
  }

  return (
    <form onSubmit={handleLogin} className="grid gap-5">
      {error && (
        <div className="rounded-2xl border border-red-300/20 bg-red-500/10 p-4 text-sm font-medium text-red-100">
          {error}
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="email" className="text-sm font-medium text-white/80">
          E-mail
        </Label>

        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/35" />

          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isLoading}
            autoComplete="email"
            className="h-12 rounded-2xl border-white/10 bg-white/5 pl-11 text-white placeholder:text-white/35 shadow-inner shadow-black/10 focus-visible:ring-2 focus-visible:ring-[hsl(var(--sidebar-accent))] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password" className="text-sm font-medium text-white/80">
          Senha
        </Label>

        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/35" />

          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
            className="h-12 rounded-2xl border-white/10 bg-white/5 pl-11 text-white placeholder:text-white/35 shadow-inner shadow-black/10 focus-visible:ring-2 focus-visible:ring-[hsl(var(--sidebar-accent))] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="mt-1 h-12 rounded-2xl bg-white text-[hsl(var(--primary))] font-semibold shadow-lg shadow-black/10 transition-all hover:scale-[1.01] hover:bg-white/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
        {isLoading ? "Autenticando..." : "Entrar"}
      </Button>
    </form>
  );
}
