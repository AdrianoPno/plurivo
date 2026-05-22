"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@shared/auth/auth-context.js";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  useEffect(() => {
    // Se o usuário já estiver autenticado e o carregamento inicial do auth tiver terminado, redireciona
    if (!isAuthLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isAuthLoading, router, redirectTo]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setError(null);
    setIsLoading(true);

    try {
      // A lógica de login agora está centralizada no AuthProvider
      await login(email, password);
      // O redirecionamento é tratado pelo useEffect acima
      router.push(redirectTo);
    } catch (err: any) {
      console.error("Auth Exception:", err);

      // O AppError vem do nosso AuthProvider agora
      if (err.message) {
        setError(err.message);
      } else if (
        // Erros específicos do Firebase Auth
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

  // Não renderiza o formulário se já estiver autenticado e prestes a redirecionar
  if (isAuthLoading || isAuthenticated) {
    return (
      <div className="text-center text-gray-500">Verificando sessão...</div>
    );
  }

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
