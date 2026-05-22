"use client";

import { useMemo } from "react";
import Link from "next/link";
import { PrivateRoute } from "@shared/auth/private-route.js";
import { useAuth } from "@shared/auth/auth-context.js";
import { MODULE_CONFIGS, ModuleConfig } from "@shared/constants/modules.js";

function ModuleCard({ module }: { module: ModuleConfig }) {
  return (
    <Link
      href={module.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block transform rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <module.Icon className="h-8 w-8 text-blue-600 transition-colors group-hover:text-blue-700" />
      <h3 className="mt-4 text-lg font-bold text-gray-800">{module.name}</h3>
      <p className="mt-1 text-sm text-gray-600">{module.description}</p>
    </Link>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();

  const availableModules = useMemo(() => {
    if (!user) return [];

    // Usuário SUPER tem acesso a todos os módulos
    if (user.role === "SUPER") {
      return MODULE_CONFIGS;
    }

    // Filtra os módulos com base nas permissões específicas do usuário
    const userModuleIds = user.permissions.map((p) => p.moduleId);
    return MODULE_CONFIGS.filter((module) => userModuleIds.includes(module.id));
  }, [user]);

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
          {availableModules.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableModules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Você não tem permissão para acessar nenhum módulo no momento.
            </p>
          )}
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
