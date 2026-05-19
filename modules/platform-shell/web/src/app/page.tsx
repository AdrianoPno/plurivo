"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@shared/ui/button";
import type { PlatformModule } from "@shared/types/module";

type HealthStatus = "loading" | "active" | "inactive";

const moduleHost =
  process.env.NEXT_PUBLIC_VOX_OBSERVATORY_URL ?? "http://localhost:3001";

const modules: PlatformModule[] = [
  {
    id: "vox-observatory",
    name: "Vox Observatory",
    description: "Portal de pesquisas, indicadores e gestão do observatório.",
    path: `${moduleHost}/dashboard`,
    enabled: true,
    icon: "monitor",
  },
];

export default function Page() {
  const [health, setHealth] = useState<HealthStatus>("loading");

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/health", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Health request failed");
        }

        const data = await response.json();
        setHealth(data?.status === "active" ? "active" : "inactive");
      })
      .catch(() => {
        setHealth("inactive");
      });

    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
          <div className="bg-gradient-to-r from-green-600/20 via-slate-900 to-slate-900 p-1">
            <div className="rounded-[23px] bg-slate-900 px-8 py-10 sm:px-12 sm:py-14">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl space-y-4">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
                    Portal de módulos
                  </p>
                  <h1 className="text-4xl font-bold text-white sm:text-5xl">
                    Central de aplicações da Recicleiros
                  </h1>
                  <p className="max-w-xl text-base text-slate-300 sm:text-lg">
                    Acesse os módulos ativos, acompanhe o status do sistema e
                    navegue rapidamente entre as aplicações.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-5 text-center">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                      Aplicações ativas
                    </p>
                    <p className="mt-3 text-3xl font-bold text-white">1</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-5 text-center">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                      Health geral
                    </p>
                    <p className="mt-3 text-3xl font-bold text-white">
                      {health === "loading"
                        ? "..."
                        : health === "active"
                          ? "Online"
                          : "Offline"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-lg sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-green-400">
                  Aplicativo em destaque
                </p>
                <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                  Vox Observatory
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                  Plataforma de pesquisa e indicadores do observatório. Monitore
                  o status, visualize pesquisas e entre na aplicação com um
                  clique.
                </p>
              </div>
              <div className="inline-flex items-center self-start rounded-full bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-300 shadow-sm">
                <span className="relative mr-2 flex size-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex size-3 rounded-full bg-orange-500" />
                </span>
                Breadth of ecosystem
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {modules.map((module) => (
              <article
                key={module.id}
                className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-lg"
              >
                <div className="bg-green-600/10 px-6 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-green-400">
                        Módulo disponível
                      </p>
                      <h3 className="mt-3 text-2xl font-bold text-white">
                        {module.name}
                      </h3>
                    </div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-white">
                      <span className="text-xl font-bold">V</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 px-6 py-7 sm:px-8">
                  <p className="text-base leading-7 text-slate-400">
                    {module.description}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-800 p-4">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                        Status
                      </p>
                      <p className="mt-2 font-semibold text-slate-200">
                        {module.enabled ? "Ativo" : "Desativado"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-800 p-4">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                        Porta
                      </p>
                      <p className="mt-2 font-semibold text-slate-200">3001</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      asChild
                      variant="primary"
                      size="lg"
                      className="w-full shadow-lg shadow-green-500/10 sm:w-auto"
                    >
                      <Link href={module.path}>
                        Entrar no módulo <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <span className="text-sm text-slate-500">
                      Vai abrir em {module.path}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
