"use client";

import { PrivateRoute } from "@shared/auth/private-route.js";
import { useAuth } from "@shared/auth/auth-context.js";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Bem-vindo ao Portal
          </h1>
          <button
            onClick={logout}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            Sair
          </button>
        </div>

        {user && (
          <div className="space-y-2">
            <p className="text-gray-700">
              Olá, <span className="font-semibold">{user.nome}</span>!
            </p>
            <p className="text-gray-700">
              Seu e-mail é: <span className="font-semibold">{user.email}</span>
            </p>
            <p className="text-gray-700">
              Sua permissão global é:{" "}
              <span className="font-semibold">{user.role}</span>
            </p>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Módulos Disponíveis
          </h2>
          <p className="text-gray-600">
            Aqui serão listados os cards para acesso aos módulos que o usuário
            tem permissão (Coop Manager, Vox Observatory, etc.).
          </p>
          {/* TODO: Implementar a lógica de renderização dos módulos baseada nas permissões do usuário */}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  );
}
