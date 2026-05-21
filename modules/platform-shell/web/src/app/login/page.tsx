"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@shared/firebase/client.js";
import { AppError } from "@shared/utils/app-error.js";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setError(null);
    setIsLoading(true);

    try {
      // 1. Autenticação direta no cliente do Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      if (!user) {
        throw new AppError("Falha na autenticação com o provedor.", 401);
      }

      // 2. Extração do ID Token (JWT) para enviar para a nossa API Fastify
      const idToken = await user.getIdToken();
      localStorage.setItem("platform-token", idToken);

      const apiUrl = process.env.NEXT_PUBLIC_PLATFORM_API_URL;
      if (!apiUrl) {
        throw new AppError(
          "Configuração do sistema inválida (API URL ausente).",
          500,
        );
      }

      // 3. Chamada à API para validação de RBAC/Sync de perfil
      const response = await fetch(`${apiUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AppError(
          errorData.message || "Falha ao carregar perfil de permissões.",
          response.status,
        );
      }

      const userData = await response.json();
      localStorage.setItem("platform-user", JSON.stringify(userData.data));

      // 4. Redirecionamento seguro pós-autenticação
      const redirectTo = searchParams.get("redirectTo") || "/";
      router.push(redirectTo);
    } catch (err: any) {
      console.error("Auth Exception:", err);

      if (err instanceof AppError) {
        setError(err.message);
      } else if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Credenciais inválidas. Verifique seu e-mail e senha.");
      } else {
        setError("Erro interno de comunicação ou credenciais inválidas.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          E-mail
        </label>
        <input
          type="email"
          id="email"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none text-black disabled:bg-gray-100"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Senha
        </label>
        <input
          type="password"
          id="password"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none text-black disabled:bg-gray-100"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      {error && (
        <p className="mb-4 text-center text-red-500 text-sm font-medium">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors disabled:bg-blue-400 cursor-pointer disabled:cursor-not-allowed"
      >
        {isLoading ? "Autenticando..." : "Entrar"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Login
        </h1>
        <Suspense
          fallback={
            <p className="text-center text-sm text-gray-500">
              Carregando formulário...
            </p>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
