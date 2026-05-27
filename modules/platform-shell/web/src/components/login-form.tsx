"use client";

import { useState, type FormEvent } from "react";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";

import { MODULE_URLS } from "@shared/constants/modules";
import { firebaseAuth } from "@shared/firebase/auth.js";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";

const TOKEN_KEY = "platform-token";

function getErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password"
    ) {
      return "E-mail ou senha invalidos.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Nao foi possivel entrar na plataforma.";
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password,
      );
      const idToken = await credential.user.getIdToken();

      const response = await fetch(`${MODULE_URLS.platformShell.api}/auth/me`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ?? "Usuario sem permissao para acessar a plataforma.",
        );
      }

      if (result?.data?.ativo === false) {
        throw new Error("Usuario inativo. Fale com um administrador.");
      }

      localStorage.setItem(TOKEN_KEY, idToken);
      window.location.assign("/");
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={isLoading}
          placeholder="voce@recicleiros.org.br"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
          disabled={isLoading}
          placeholder="Sua senha"
        />
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
