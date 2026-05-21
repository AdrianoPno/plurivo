import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100 sm:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="rounded-[32px] border border-slate-800 bg-slate-900/70 p-10 shadow-soft backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_auto] lg:items-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">
                Coop Manager
              </p>
              <h1 className="text-4xl font-semibold text-white sm:text-5xl">
                Gestão de cooperados, unidades e usuários em um só lugar.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300">
                Acesse relatórios de atividades, cadastre cooperados e mantenha
                o controle de unidades com uma interface alinhada ao padrão do
                monorepo.
              </p>
            </div>
            <div className="rounded-[28px] bg-slate-950 p-6 ring-1 ring-slate-800">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
                  Módulo ativo
                </p>
                <h2 className="text-2xl font-semibold text-white">
                  Coop Manager
                </h2>
                <p className="text-slate-400">
                  Frontend em Next, integrado ao `shared/ui`, com backend
                  independente e APIs de administração.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    <Link href="/login">
                      Entrar <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Login seguro",
              description:
                "Autenticação Firebase e verificação do backend via token JWT.",
            },
            {
              title: "Administração central",
              description:
                "Controle cooperados, unidades e usuários com permissões de SUPER e ADMIN.",
            },
            {
              title: "Monorepo integrado",
              description:
                "Mesmo padrão do Vox Observatory com Next + shared/ui + deploy uniforme.",
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
            >
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {item.description}
              </p>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
