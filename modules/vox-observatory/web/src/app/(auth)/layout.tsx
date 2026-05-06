import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[hsl(var(--primary))]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_30%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_35%)]" />

      <div className="relative z-10 grid min-h-screen w-full lg:grid-cols-2">
        <div className="hidden flex-col justify-between border-r border-white/10 p-12 lg:flex">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-white backdrop-blur-sm">
              Vox Observatory
            </div>

            <div className="max-w-xl space-y-5">
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-white">
                Research Intelligence Platform
              </h1>

              <p className="text-lg leading-relaxed text-white/70">
                Centralize pesquisas, insights e análises estratégicas em uma
                única plataforma moderna e colaborativa.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-sm font-medium text-white">
                Inteligência operacional
              </p>

              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Consolide descobertas, acompanhe métricas e evolua decisões com
                base em dados.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-sm font-medium text-white">
                Plataforma colaborativa
              </p>

              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Compartilhe pesquisas, artefatos e insights entre times e áreas
                estratégicas.
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
